import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DepositModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(DepositModule)
  .catch(err => console.error(err));
