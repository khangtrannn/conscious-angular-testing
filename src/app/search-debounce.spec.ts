import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { Component, inject, Injectable, OnInit } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { debounceTime, delay, map, of, switchMap, tap, timer } from "rxjs";

@Injectable({
  providedIn: 'root'
})
class UserService {
  search(term: string) {
    return of([]);
  }
}

@Component({
  selector: 'app-list',
  standalone: true,
  template: `
    <input data-testId="search-input" [formControl]="searchControl" /> 

    <p *ngIf="loading" data-testId="loading">{{ loading }}</p>

    <ul>
      <li *ngFor="let user of users$ | async">
        {{ user.id }}
      </li>
    </ul>
  `,
  imports: [ReactiveFormsModule, NgFor, NgIf, AsyncPipe]
})
class ListComponent {
  #userService = inject(UserService); 

  searchControl = new FormControl();
  loading = false;

  users$ = this.searchControl.valueChanges.pipe(
    debounceTime(100),
    tap(() => this.loading = true),
    switchMap((term) => this.#userService.search(term)),
    tap(() => {

      console.log('update loading to false');
      this.loading = false;
    }),
  );
}

describe(ListComponent.name, () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let userServiceMock = {
    search: jest.fn(),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
      ]
    });

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  })

  it('should search users', fakeAsync(() => {
    jest.spyOn(userServiceMock, 'search').mockReturnValue(timer(100).pipe(map(() => [{ id: 1 }, { id: 2 }])));

    // Search
    const searchInput = fixture.debugElement.query(By.css(`[data-testId="search-input"]`));
    searchInput.nativeElement.value = 'Khang';
    searchInput.nativeElement.dispatchEvent(new Event('input'));

    // Advance the clock by 100 milis to run debounceTime(100)
    tick(100);
    fixture.detectChanges();
    let loading = fixture.debugElement.query(By.css('[data-testId="loading"]'));
    expect(loading).toBeTruthy();

    // Advance the clock by 100 milis to run userService.search()
    tick(100);
    fixture.detectChanges();

    expect(userServiceMock.search).toHaveBeenCalledWith('Khang');
    loading = fixture.debugElement.query(By.css('[data-testId="loading"]'));
    expect(loading).toBeNull();

    const list = fixture.debugElement.queryAll(By.css('li'));
    expect(list.length).toEqual(2);
  }));
});