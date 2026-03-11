import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  @Input() username: string | any = '';
  @Input() avatar: Base64URLString = '';

}
