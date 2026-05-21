import { Component } from '@angular/core';
import { UiTextComponent } from '../../shared/ui/ui-text/ui-text.component';

@Component({
  selector: 'app-infinite-scroll',
  imports: [UiTextComponent],
  templateUrl: './infinite-scroll.html',
  styleUrl: './infinite-scroll.scss',
})
export class InfiniteScroll {}
