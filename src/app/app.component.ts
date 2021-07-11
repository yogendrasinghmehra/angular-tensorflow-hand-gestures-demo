import { Component, ElementRef, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, withLatestFrom } from 'rxjs/operators';
import { HandGesture } from './hand-gesture.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('video') video: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('home') homeLink: ElementRef<HTMLAnchorElement>;
  @ViewChild('about') aboutLink: ElementRef<HTMLAnchorElement>;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
    opened$ = this._recognizer.swipe$.pipe(
      filter((value) => value === 'left' || value === 'right'),
      map((value) => value === 'right')
    );
  
    selection$ = this._recognizer.gesture$.pipe(
      filter((value) => value === 'one' || value === 'two'),
      map((value) => (value === 'one' ? 'home' : 'about'))
    );

  constructor(private breakpointObserver: BreakpointObserver,private _recognizer: HandGesture, private _router: Router) {
    this._recognizer.gesture$
    .pipe(
      filter((value) => value === 'ok'),
      withLatestFrom(this.selection$)
    )
    .subscribe(([_, page]) => this._router.navigateByUrl(page));
  }

  get stream(): MediaStream {
    return this._recognizer.stream;
  }

  ngAfterViewInit(): void {
    this._recognizer.initialize(
      this.canvas.nativeElement,
      this.video.nativeElement
    );
  }
  
}
