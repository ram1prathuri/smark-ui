import { Directive, ElementRef, HostListener, Input, OnDestroy, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { Overlay, OverlayRef, ConnectionPositionPair } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { UiPopoverComponent } from './ui-popover.component';

@Directive({
  selector: '[uiPopover]',
  standalone: true
})
export class UiPopoverDirective implements OnDestroy {
  @Input('uiPopover') popoverComponent!: UiPopoverComponent;
  @Input() popoverTrigger: 'click' | 'hover' = 'click';

  private overlay = inject(Overlay);
  private elementRef = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);
  
  private overlayRef: OverlayRef | null = null;
  private isOpen = false;

  @HostListener('click')
  onClick() {
    if (this.popoverTrigger === 'click') {
      this.isOpen ? this.close() : this.open();
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.popoverTrigger === 'hover') {
      this.open();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.popoverTrigger === 'hover') {
      this.close();
    }
  }

  open() {
    if (this.isOpen) return;

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        new ConnectionPositionPair(
          { originX: 'start', originY: 'bottom' },
          { overlayX: 'start', overlayY: 'top' },
          0, 8 // Offset Y by 8px
        ),
        new ConnectionPositionPair(
          { originX: 'start', originY: 'top' },
          { overlayX: 'start', overlayY: 'bottom' },
          0, -8
        )
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: this.popoverTrigger === 'click',
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });

    const portal = new TemplatePortal(this.popoverComponent.template, this.viewContainerRef);
    this.overlayRef.attach(portal);
    this.isOpen = true;

    if (this.popoverTrigger === 'click') {
      this.overlayRef.backdropClick().subscribe(() => this.close());
    }
  }

  close() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
      this.isOpen = false;
    }
  }

  ngOnDestroy() {
    this.close();
  }
}
