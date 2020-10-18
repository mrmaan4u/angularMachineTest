import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Properties } from '../modals/properties.modal';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  temp = [];

  propertiesData = new BehaviorSubject<Properties[]>([]);

  get properties(): Properties[] {
    return this.propertiesData.getValue();
  }

  constructor(private http: HttpClient) {}

  getProperties(): Promise<any> {
    return this.http
      .get('assets/data/properties.json')
      .pipe(
        map((tempData) => JSON.parse(JSON.stringify(tempData)).data),
        map((propertiesArray) => {
          return propertiesArray.map((propertyData) => {
            return {
              name: propertyData?.name,
              buildingName: propertyData?.building?.name,
              towerName: propertyData?.building_towers?.tower_name,
              propertyType: propertyData?.property_type?.name,
              configurationName: propertyData?.configuration?.name,
              minPrice: propertyData?.min_price,
              bedroom: propertyData?.bedroom,
              bathroom: propertyData?.bathroom,
              halfBathroom: propertyData?.half_bathroom,
            };
          });
        }),
        tap((properties) => {
          this.propertiesData.next([...properties]);
        })
      )
      .toPromise();
  }
}
