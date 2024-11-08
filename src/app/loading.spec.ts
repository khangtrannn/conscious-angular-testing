import { NgIf } from "@angular/common";
import { Component, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

@Component({
  template: `
    <div data-testId="loading" *ngIf="loading">Loading...</div>
  `,
  standalone: true,
  imports: [NgIf]
})
class LoadingComponent {
  loading = false;
}

describe(LoadingComponent, () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should hide loading by default', () => {
    const loading = debugElement.query(By.css('[data-testId="loading"]'));
    expect(loading).toBeNull();
  });

  it('should show loading', () => {
    component.loading = true;

    fixture.detectChanges();

    const loading = debugElement.query(By.css('[data-testId="loading"]'));
    expect(loading).toBeTruthy();
  });
});