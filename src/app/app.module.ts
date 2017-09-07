import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageZoomModule } from 'angular2-image-zoom';
import { NouisliderModule } from 'ng2-nouislider';
import { SocketIoModule } from 'ng2-socket-io';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserGlobalRef, GlobalRef } from './global-ref';
import { AboutComponent } from './pages/about/about.component';
import { AuthModule } from './pages/auth/auth.module';
import { DialogService } from './pages/auth/dialog/dialog.component';
import { CharMakerComponent } from './pages/char-maker/char-maker.component';
import { DnaCodeComponent } from './pages/dna-code/dna-code.component';
import { CharGenComponent } from './pages/char-gen/char-gen.component'; 
import { ExportGameComponent } from './pages/export-game/export-game.component';
import { GameMakerComponent } from './pages/game-maker/game-maker.component';
import { GunInterpModule } from './pages/gun-gen/gun-gen.module';
import { GunInterpService } from './pages/gun-gen/gun-gen.service';
import { HomeModule } from './pages/home/home.module';
import { LibraryService } from './pages/library/library.service';
import { RepositoryModule } from './pages/repository/repository.module';
import { RepositoryService } from './pages/repository/repository.service';
import { SniperComponent } from './pages/sniper/sniper.component';
import { TerrainGenModule } from './pages/terrain-gen/terrain-gen.module';
import { TerrainGenService } from './pages/terrain-gen/terrain-gen.service';
import { SeoService } from './seo.service';
import { GameMakerStartComponent } from './pages/game-maker-start/game-maker-start.component';
import { TutorialComponent } from './pages/tutorial/tutorial.component';
import { BlogComponent } from './pages/blog/blog.component';
import { Blog1Component } from './pages/blog1/blog1.component';
import { Blog2Component } from './pages/blog2/blog2.component';
import { Blog3Component } from './pages/blog3/blog3.component';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SwiperModule, SwiperConfigInterface } from 'ngx-swiper-wrapper';

const SWIPER_CONFIG: SwiperConfigInterface = {
    direction: 'horizontal',
    threshold: 25,
    slidesPerView: '1',
    keyboardControl: false,
    centeredSlides: false,

};
const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: false,
};


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ExportGameComponent,
    CharMakerComponent,
    DnaCodeComponent,
    CharGenComponent,
    GameMakerComponent,
    SniperComponent,
    GameMakerStartComponent,
    TutorialComponent,
    BlogComponent,
    Blog1Component,
    Blog3Component,
    Blog2Component
    ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    NgbModule.forRoot(),
    NouisliderModule,
    AppRoutingModule,
    AuthModule,
    HomeModule,
    RepositoryModule,
    TerrainGenModule,
    SocketIoModule,
    GunInterpModule,
    ImageZoomModule,
    ReactiveFormsModule,
    PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
    SwiperModule.forRoot(SWIPER_CONFIG),
  ],
  providers: [
    { provide: GlobalRef, useClass: BrowserGlobalRef },
    DialogService,
    LibraryService,
    RepositoryService,
    TerrainGenService,
    GunInterpService,
    SeoService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
