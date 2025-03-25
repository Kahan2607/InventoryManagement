import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteInfoMessageComponent } from './delete-info-message.component';

describe('DeleteInfoMessageComponent', () => {
  let component: DeleteInfoMessageComponent;
  let fixture: ComponentFixture<DeleteInfoMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteInfoMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteInfoMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
