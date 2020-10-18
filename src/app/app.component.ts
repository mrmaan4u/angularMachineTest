import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { BehaviorSubject } from 'rxjs';
import { Properties } from './modals/properties.modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  properties = new BehaviorSubject<Properties[]>([]);
  search;
  sortType = true;
  minPriceFilter = 0;
  filterConfig = [];
  selectedConfigValue = [];

  constructor(private dataService: DataService) {}

  async ngOnInit(): Promise<void> {
    const temp = await this.dataService.getProperties();
    this.properties.next([...this.dataService.properties]);

    // Create unique Configuration
    this.getUniqueConfiguration();
  }

  sortProperties(ev): void {
    this.sortType = !this.sortType;
    const propertyField = ev.srcElement.attributes[1].nodeValue;

    if (this.sortType) {
      this.properties
        .getValue()
        .sort((a, b) => (a[propertyField] > b[propertyField] ? 1 : -1));
    } else {
      this.properties
        .getValue()
        .sort((a, b) => (a[propertyField] > b[propertyField] ? -1 : 1));
    }
  }

  minTypeFilter(): void {
    const filteredData = this.dataService.properties.filter((pf) => {
      if (pf.minPrice >= this.minPriceFilter) {
        return true;
      } else {
        return false;
      }
    });

    this.properties.next([...filteredData]);
  }

  getUniqueConfiguration(): void {
    this.filterConfig = this.properties
      .getValue()
      .filter(
        (conf, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.configurationName === conf.configurationName &&
              t.configurationName === conf.configurationName
          )
      );
  }

  selectUpdate(): void {
    const filteredConfig = [];

    this.dataService.properties.filter((fConfig) =>
      this.selectedConfigValue.forEach((configValue) => {
        if (fConfig.configurationName === configValue) {
          filteredConfig.push(fConfig);
        }
      })
    );

    this.properties.next([...filteredConfig]);
  }
}
