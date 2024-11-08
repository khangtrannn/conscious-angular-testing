import { NgFor, NgIf } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject, Injectable, OnInit } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { defer, of } from "rxjs";

interface Todo {
  id: number;
}

@Injectable({
  providedIn: 'root',
})
class TodosService {
  #http = inject(HttpClient);

  getAll() {
    return this.#http.get<Todo[]>('https://dummyjson.com/todos');
  }
}

@Component({
  selector: 'app-todos',
  standalone: true,
  template: `
    <div class="loading" *ngIf="isLoading">Loading...</div>
    <div *ngFor="let todo of todos" class="todo">
      {{todo.id}}
    </div>
  `,
  imports: [NgFor, NgIf],
})
class TodosComponent implements OnInit {
  #todosService = inject(TodosService);

  todos: Todo[] = [];
  isLoading: boolean | undefined;

  ngOnInit(): void {
    this.isLoading = true;

    this.#todosService.getAll().subscribe((todos) => {
      this.todos = todos;
      this.isLoading = false;
    });
  }
}

describe(TodosComponent.name, () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;

  const todosServiceStub = {
    // ⚠️ By default, the `of()` observable is synchronous, so you're basically making asynchronous code synchronous
    getAll: () => of([{ id: 1 }]),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TodosComponent],
      providers: [
        {
          provide: TodosService,
          useValue: todosServiceStub,
        }
      ]
    });

    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shoud render todo list', () => {
    expect(fixture.nativeElement.querySelectorAll('.todo').length).toEqual(1);
  });

  it('should NOT work', () => {
    // The loading element should be visible
    expect(fixture.nativeElement.querySelector('.loading')).not.toBeNull();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.todo').length).toEqual(1);
    // The loading element should be hidden
    expect(fixture.nativeElement.querySelector('.loading')).toEqual(0);
  });

  it('should render todo list defer()', async () => {
    jest.spyOn(todosServiceStub, 'getAll').mockImplementation(() => fakeAsyncResponse([{ id: 1 }]));
    component.ngOnInit();
    fixture.detectChanges();

    let loading = fixture.nativeElement.querySelector('.loading');
    expect(loading).not.toBeNull();

    await fixture.whenStable();
    fixture.detectChanges();

    const todos = fixture.nativeElement.querySelectorAll('.todo');
    loading = fixture.nativeElement.querySelector('.loading');
    expect(loading).toBeNull();
    expect(todos.length).toBe(1);
  });
});

export function fakeAsyncResponse<T>(data: T) {
  return defer(() => Promise.resolve(data));
}