import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { EnqueteData } from '../../types';
import { EnqueteService } from '../../services/enquete.service';

@Component({
  selector: 'app-enquete-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './enquete.modal.html',
  styleUrls: ['./enquete.modal.css']
})
export class EnqueteModal implements OnChanges {

  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Input() enquete?: EnqueteData; 
  @Output() enqueteChange = new EventEmitter<EnqueteData>();

  enqueteForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private enqueteService: EnqueteService
  ) {
    this.enqueteForm = this.fb.group({
      enquete_name: ['', [Validators.required, Validators.minLength(6)]],
      description: ['', [Validators.required, Validators.minLength(6)]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      category: ['', [Validators.required, Validators.minLength(2)]],
      status: ['draft', Validators.required]
    }, { validators: this.dateValidator });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['enquete']) {
      this.updateForm();
    }
  }

  private updateForm() {
    if (this.enquete) {
      const formatDate = (date: Date | null): string | undefined => {
        if (!date) return undefined;
        const d = new Date(date);
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return `${d.getFullYear()}-${month}-${day}`;
      };

      this.enqueteForm.patchValue({
        enquete_name: this.enquete.enquete_name,
        description: this.enquete.description,
        startDate: formatDate(this.enquete.startDate),
        endDate: formatDate(this.enquete.endDate),
        category: this.enquete.category,
        status: this.enquete.status
      });
    } else {
      this.enqueteForm.reset(); // reset si création
    }
  }

  dateValidator(group: FormGroup) {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    if (start && end && start >= end) {
      return { dateInvalid: true };
    }
    return null;
  }

  closeModal() {
    this.open = false;
    this.openChange.emit(false);
    this.updateForm(); // réinitialise ou met à jour le formulaire pour la prochaine ouverture
  }

  handleSubmit() {
    if (this.enqueteForm.invalid) {
      this.enqueteForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const surveyData: EnqueteData = {
      ...this.enqueteForm.value,
      startDate: this.enqueteForm.value.startDate 
        ? new Date(this.enqueteForm.value.startDate).toISOString()
        : null,
      endDate: this.enqueteForm.value.endDate 
        ? new Date(this.enqueteForm.value.endDate).toISOString()
        : null
    };

    if (this.enquete) {
      // Mode édition
      this.enqueteService.updateEnquete(this.enquete.id_enquete, surveyData)
        .subscribe({
          next: (res:any) => {
            alert('Enquête modifiée avec succès !');
            this.enqueteChange.emit(res.data);            this.closeModal();
            this.router.navigate(['/enquetes', this.enquete!.id_enquete]);
          },
          error: err => {
            console.error("Erreur lors de la modification :", err);
            alert("Erreur lors de la modification de l'enquête");
          },
          complete: () => this.isSubmitting = false
        });
    } else {
      // Mode création
      this.enqueteService.createEnquete(surveyData)
        .subscribe({
          next: res => {
            alert("Enquête créée avec succès !");
            this.enqueteForm.reset();
            this.closeModal();
            this.router.navigate(['/enquetes', res.id_enquete]);
          },
          error: err => {
            console.error("Erreur lors de la création:", err);
            alert("Erreur lors de la création de l'enquête");
          },
          complete: () => this.isSubmitting = false
        });
    }
  }
}
