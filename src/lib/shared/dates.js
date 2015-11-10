'use strict';

import moment from 'moment';

export class DateUtils {

    static getPriceBandMonthName(dt) {

      if (dt.getMonth() === 6 && dt.getDate() < 16)
        return 'July (1-15)';

      if (dt.getMonth() === 6)
        return 'July (16-31)';

      if (dt.getMonth() === 11 && dt.getDate() > 1)
        return 'Christmas/New Year';

      return moment(dt).format('MMMM');

    }

}
