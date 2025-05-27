import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgOptimizedImage } from '@angular/common';
import {MatAnchor, MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';



@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatToolbarModule, NgOptimizedImage, MatButton, RouterLink, MatAnchor],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  scrollToSection() {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

}
