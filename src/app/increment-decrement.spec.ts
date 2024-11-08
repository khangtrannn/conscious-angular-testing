import { Component, inject, Injectable } from "@angular/core";
import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

@Injectable({
  providedIn: 'root',
})
class IncrementDecrementService {
  value = 0;
  message = '';

  increment() {
    setTimeout(() => {
      if (this.value < 15) {
        this.value += 1;
      } else {
        this.message = 'Maximum reached!';
      }
    }, 5000);
  }
}

@Component({
  selector: 'app-increment-decrement',
  template: `
    <h1>{{ service.value }}</h1>
    <button data-testid="increment-button" (click)="service.increment()">Increment</button>
  `,
  standalone: true,
})
class IncrementDecrementComponent {
  service = inject(IncrementDecrementService);
}

describe('IncrementDecrementComponent', () => {
  it('should increment in template after 5 seconds', fakeAsync(() => {
    const fixture = TestBed.createComponent(IncrementDecrementComponent);

    fixture.debugElement
      .query(By.css('[data-testid="increment-button"]'))
      .triggerEventHandler('click');

    tick(2000);

    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(element.textContent).toEqual("0"); // value should still be 0 after 2 seconds

    tick(3000);

    // fixture.detectChanges();
    expect(element.textContent).toEqual("1"); // 3 seconds later, our value should now be 1
  })); 

  it('should increment in template (flush)', fakeAsync(() => {
    const fixture = TestBed.createComponent(IncrementDecrementComponent);

    fixture.debugElement
      .query(By.css('[data-testId="increment-button"]'))
      .triggerEventHandler('click', null);

    flush();
    fixture.detectChanges();

    const value = fixture.debugElement.query(By.css('h1')).nativeElement.textContent;
    expect(value).toEqual('1');
  }));
});