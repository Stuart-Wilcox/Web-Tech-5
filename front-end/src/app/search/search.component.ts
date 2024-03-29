import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [DashboardService, SearchService]
})
export class SearchComponent implements OnInit {
  loading: boolean;
  user: object;
  results: object;
  authorized: boolean;

  constructor(private dashboardService:DashboardService, private searchService:SearchService) {
    this.loading=true;
    this.user=null;
    this.results = [[],[],[],[]];
  }

  validateInput(event, q){
    event.preventDefault();
    if(!q){
      //searched with no content so do nothing
      return;
    }else{
      this.results = [[],[],[],[]];
      //do async search
      this.searchService.search(q).subscribe(
        data=>{
          //data will be huge probably
          console.log(data);
           for(let i = 0; i < data['collection'].items.length; i++){
             try{
               let item = data['collection'].items[i];
               if(item.links[0].render=="image"){
                 this.results[i%4].push({url: item.links[0].href, description:item.data[0].description, asset_id:item.data[0].nasa_id});
               }
             }catch(e){
               continue;
             }
           }
        },
        err=>{
          this.authorized=false;
          this.loading=false;
          console.log(err);
        }
      );
    }
  }

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
  }

  selectImage(event){
    console.log(event.target.src.split("/")[4]);
  }

  ngOnInit() {
    let token = this.getCookie("token");
    if(token){
      this.dashboardService.getUserData(token).subscribe(
        data => {
            this.authorized=true;
            this.user=data;
            this.loading=false;
        },
        err => {
          console.log(err);
          this.authorized=false;
          this.loading=false;
        }
      );
    }else{
      this.authorized=false;
      this.loading=false;
    }
  }

}
