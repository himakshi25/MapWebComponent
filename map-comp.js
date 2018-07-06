import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
/**
 * `map-comp`
 * shows the map and location pointer of the position given and to show accuracy by representing with circle
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class MapComp extends PolymerElement {

  constructor()
  {
    super();
    this.circle = null;
    this.marker=null;
    this.map=null;
  }
  connectedCallback() {                //add listener
    super.connectedCallback();
    window.addEventListener('touchmove', event => {   // page become more responsive to scroll
      console.log(event);
    },{passive: true});
  }

  disconnectedCallback() {            //remove listener prevent memory leak
    super.disconnectedCallback();
    window.removeEventListener('touchmove', event => {
      console.log(event);
    },{passive: true});
  }
  ready()
  {
    super.ready();
    var elt=document.createElement('script');
    elt.type = 'text/javascript';
    window.initGoogleMapApi = this.initGoogleMap.bind(this);
    elt.src='https://maps.googleapis.com/maps/api/js?key=AIzaSyCF9soBfM0LVmScVCkknTyqL7GAOF7g3D0&callback=initGoogleMapApi';
    this.$.tag.appendChild(elt);
  }

  initGoogleMap()
  {
    let latlong={lat:this.latitude,lng:this.longitude };
    let acc=this.accuracy;
    // set properties of map
    let mapOptions={
      zoom:8,
      mapTypeId: 'terrain', //'satellite';
      center: latlong//or new google.maps.LatLng(28.455134,77.071841)
    }
    //creates the map
    this.map= new google.maps.Map(this.$.mapcanvas,mapOptions); //??????????????

    // set the marker
    this.marker = new google.maps.Marker({
        position: latlong,
        map:this.map,
        title:'hello'
    });

    // draw a circle to tell the accuracy that we can be anywhere in this circle
    this.circle = new google.maps.Circle({
           strokeColor: '#0000FF',
           strokeOpacity: 0.8,
           strokeWeight: 2,
           fillColor: '#0000FF',
           fillOpacity: 0.2,
           map: this.map,
           center: latlong,
           radius: acc,
           //editable: true
    });
  }

  static get template()
  {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <div id="tag">
       <div style="height:650px; width:100%;" id="mapcanvas"></div>
      </div>
    `;
  }

  static get properties() {

    return {
      longitude: {
        type: Number,
        observer: 'longChanged'
      },
      latitude: {
        type: Number,
        observer: 'latChanged'
      },
      accuracy: {
        type: Number,
        observer: 'accChanged'
      }
    };
  }

 longChanged()
 {
   //console.log(this.map+' '+this.marker+' '+this.circle);
   if(this.map!=null && this.marker!=null && this.circle!=null)
   {
       console.log(this.longitude);
       let latlng={lat:this.latitude,lng:this.longitude };
       this.marker.setPosition(latlng);

    }
 }
 latChanged()
 {
   //console.log(this.map+' '+this.marker+' '+this.circle);
   if(this.map!=null && this.marker!=null && this.circle!=null)
   {
       console.log(this.latitude);
       let latlng={lat:this.latitude,lng:this.longitude };
       this.marker.setPosition(latlng);
  }
 }
 accChanged()
 {
   //console.log(this.map+' '+this.marker+' '+this.circle);
   if(this.map!=null && this.marker!=null && this.circle!=null)
   {
     let latlng={lat:this.latitude,lng:this.longitude };
     this.circle.setRadius(this.accuracy);
     this.circle.setCenter(latlng);
     console.log(this.circle.getRadius());
   }
 }

}

window.customElements.define('map-comp', MapComp);
