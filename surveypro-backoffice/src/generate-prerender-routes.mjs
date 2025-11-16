import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

const enquetes = await prisma.enquete.findMany({ select: { id_enquete: true } });
const routes = enquetes.map(e => ({ id_enquete: e.id_enquete.toString() }));

fs.writeFileSync('src/prerender-routes.json', JSON.stringify(routes, null, 2));
console.log("✅ Routes générées:", routes);
