export interface Area {
  name: string;
  minimum_fl: number;
  maximum_fl: number;
  start_datetime: Date;
  end_datetime: Date;
}

export interface Euup {
  notice_info: string;
  valid_wef: Date;
  valid_til: Date;
  released_on: Date;
  areas: Area[];
}
