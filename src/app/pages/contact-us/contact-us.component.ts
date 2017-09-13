import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Http, RequestOptions, Headers, URLSearchParams} from '@angular/http'
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  @ViewChild('contactSuccessModal') contactSuccessModal: ModalDirective;
  contactForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: Http
  ) {
    this.contactForm = this.formBuilder.group({
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      message: new FormControl(''),
    });
  }

  submitMessage(): void {
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
    this.http.post('https://norah.ai/bat/MailHandler.php', this.contactForm.value , options).subscribe((response) => {
      if (response.status === 200) {
        this.contactSuccessModal.show()
      }
    })
  }
}
