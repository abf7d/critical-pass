import { Directive, EventEmitter, HostListener, Output, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[outsideClick]',
})
export class OutsideClickDirective {
    @Output()
    outListSelect: EventEmitter<MouseEvent> = new EventEmitter();
    @Output()
    inListSelect: EventEmitter<MouseEvent> = new EventEmitter();

    @Input() skipList: string[];

    @HostListener('document:mousedown', ['$event'])
    onClick(event: MouseEvent): void {
        let currentElement = event.target;
        let allowTtrigger = true;
        while (currentElement) {
            if (typeof (currentElement as any).className === 'string') {
                const found = this.skipList.filter(s => (currentElement as any).className?.includes(s));
                if (found.length) {
                  allowTtrigger = false;
                    break;
                }
            }
            currentElement = (currentElement as any).parentElement;
        }
        if (!this.elementRef.nativeElement.contains(event.target) && allowTtrigger) {
            this.outListSelect.emit(event);
        } else if (!this.elementRef.nativeElement.contains(event.target) && this.inListSelect.observers.length > 0) {
            this.inListSelect.emit(event);
        }
    }

    constructor(private elementRef: ElementRef) {}
}
