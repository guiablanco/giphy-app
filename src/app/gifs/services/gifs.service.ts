import { Gif, SearchResponse } from './../interfaces/gifs.interfaces';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private API_KEY:      string = 'hPIS12zdRkmrA359sZSBOKSGB5hPzHB1';
  private serviceUrl:   string = 'https://api.giphy.com/v1/gifs';
  private quantityGifs: number = 10;


  constructor(private http: HttpClient) {

    this.loadLocalStorage();
    console.log('Gifs service ready');
  }

  get tagsHistory(){
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string){
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0,9);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory))
  }

  private loadLocalStorage(): void {
    if(!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if( this._tagsHistory.length === 0 ) return;
    this.searchTag( this._tagsHistory[0] );
  }

  searchTag(tag: string): void {
    if(tag.length === 0) return;
    this.organizeHistory(tag)


    const params = new HttpParams()
      .set('api_key', this.API_KEY)
      .set('q', tag)
      .set('limit', 10)


    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params})
      .subscribe( resp => {
        this.gifList = resp.data;
        console.log({gifs: this.gifList});


      })

    // fetch('http://api.giphy.com/v1/gifs/search?api_key=hPIS12zdRkmrA359sZSBOKSGB5hPzHB1&q=valorant&limit=10')
    //   .then(resp => resp.json())
    //   .then(data => console.log(data));



  }



}
