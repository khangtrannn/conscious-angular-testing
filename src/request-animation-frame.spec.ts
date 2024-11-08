import { Component, OnInit } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

@Component({
  template: `<p>{{ value }}</p>`,
  standalone: true,
})
class AnimationFromComponent implements OnInit {
  value = '';

  ngOnInit() {
    requestAnimationFrame(() => {
      this.value = 'requestAnimationFrame';
    });
  }
}

describe('AnimationFrameComponent', () => {
  it('should run requestAnimationFrame', fakeAsync(() => {
    const fixture = TestBed.createComponent(AnimationFromComponent);
    fixture.detectChanges();

    tick(16);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('p')).nativeElement.textContent).toEqual('requestAnimationFrame');
  }));
});