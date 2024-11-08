import { NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

@Component({
  template: `
    <div *ngIf="loading">Loading...</div>
  `,
  standalone: true,
  imports: [NgIf]
})
class LoadingComponent {
  loading = false;
}

describe(LoadingComponent, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoadingComponent],
    })
  });

  it('should hide loading by default', () => {
    
  });
});