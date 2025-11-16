import { Routes } from '@angular/router';
import { Enquete } from './pages/enquete/enquete';

// Routes normales Angular (runtime)
export const routes: Routes = [
  { path: 'enquetes/:id_enquete', component: Enquete }
];

// Routes utilisées uniquement par le prerender (pas par Angular Router)
import { RenderMode, type ServerRoutePrerenderWithParams } from '@angular/ssr';

export const prerenderRoutes: ServerRoutePrerenderWithParams[] = [
  {
    path: 'enquetes/:id_enquete',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const res = await fetch('http://localhost:3000/enquetes');
      const json = await res.json();
      console.log(json)
      // Si ton API retourne un seul objet
      if (!Array.isArray(json.data)) {
        return [{ id_enquete: json.data.id_enquete.toString() }];
      }

      // Si ton API retourne une liste d'objets dans `data`
      return json.data.map((e: any) => ({
        id_enquete: e.id_enquete.toString()
      }));
    }
  }
];
