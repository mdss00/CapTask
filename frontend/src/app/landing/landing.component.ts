import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgOptimizedImage } from '@angular/common';
import { MatButton } from '@angular/material/button';



@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatToolbarModule, NgOptimizedImage, MatButton],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  scrollToSection() {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

}
