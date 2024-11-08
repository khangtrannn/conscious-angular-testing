import { Component } from "@angular/core";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

@Component({
  selector: 'app-test',
  template: `
    <h1>{{ title }}</h1>
    <button data-testId="set-title" (click)="setTitle()">Set Title</button>
  `,
  standalone: true,
})
class TestComponent {
  title = 'Initial Title!';

  setTitle() {
    new Promise<string>((resolve) => resolve('Async Title!')).then((newTitle) => {
      this.title = newTitle;
    });
  }
}

describe('TestComponent', () => {
  it('should display title (waitForAsync)', waitForAsync(() => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.debugElement
      .query(By.css('[data-testId="set-title"]'))
      .triggerEventHandler('click');

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const value = fixture.debugElement.query(By.css('h1')).nativeElement.textContent;
      expect(value).toEqual('Async Title!');
    });
  }));

  it('should display title (async/await)', async () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.debugElement
      .query(By.css('[data-testId="set-title"]'))
      .triggerEventHandler('click');

    await fixture.whenStable();
    fixture.detectChanges();
    
    const value = fixture.debugElement.query(By.css('h1')).nativeElement.textContent;
    expect(value).toEqual('Async Title!');
  });
});