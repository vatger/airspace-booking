# Airspace Booking

This projects offers a service to Vatsim pilots to book Temporary Reserved Areas [(TRA)](https://skybrary.aero/articles/temporary-reserved-area-tra).
Pilots can book defined areas, an endpoint allows fetching of the booked areas in EUUP format. Thefore allowing plugins such as Topsky to display the booked airspaces.

## Contact

|       Name        | Responsible for |      Contact      |
| :---------------: | :-------------: | :---------------: |
| Leon K. - 1424877 |       \*        | Discord: `LeoKle` |

## Prerequisites

- **Node.js** (https://nodejs.org/en)
- **Typescript**
  - Run `npm install typescript -g`
  - This installs the `tsc` command globally! If you wish to change this, you can read more on the supported installation paths [here](https://www.typescriptlang.org/download).

## Running the Application

1. Run `npm install`
2. Run `npm run dev` to start backend
3. Run `npm run spa:dev` to start frontend
