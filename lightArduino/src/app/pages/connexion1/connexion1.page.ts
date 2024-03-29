import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  LoadingController,
  AlertController,
  NavController,
  ToastController,
  ActionSheetController,
  ModalController,
} from "@ionic/angular";
import { Apollo, gql } from "apollo-angular";
import { Chart } from "chart.js";
import { AwsAmplifyService } from "src/app/data-services/aws-amplify.service";
import { DynamoDBAPIService } from "src/app/data-services/dynamo-db-api.service";
import { EnergyService } from "src/app/data-services/energyService/energy.service";
import { MessageService } from "src/app/data-services/messageService/message.service";
import { environment } from "src/environments/environment";
import "chartjs-adapter-moment";
import { LogModel } from "src/app/models/log-model";
import { ConnectionsRealtimeDataModel } from "src/app/models/connections-realtime-data-model";
import { interval, Subscription } from "rxjs";
import {
  ConnectionStatus,
  NetworkService,
} from "src/app/data-services/network.service";
import { DevicesEnum } from "src/app/utils/utilities";
import { AwsSdkService } from "./../../data-services/awsIoT/aws-sdk.service";
import { DatesPage } from "../dates-filter/dates/dates.page";

@Component({
  selector: "app-connexion1",
  templateUrl: "./connexion1.page.html",
  styleUrls: ["./connexion1.page.scss"],
})
export class Connexion1Page implements OnInit, OnDestroy {
  devicesNames = Object.values(DevicesEnum);
  devoicesList: DevicesEnum;
  @ViewChild("barChart") barChart;
  loading: any;
  selected_time: any;
  colorArray: any;
  gaugeType = "semi";
  gaugeValue = 21000;
  bars: any;
  circle: any;
  circleKwh: any;
  private turnedOff = false;
  public healthy = 0;
  private querySubscription: Subscription;
  connectionsRealtimeDataModel: ConnectionsRealtimeDataModel =
    new ConnectionsRealtimeDataModel();
  showKlhw = false;
  showKlwChekedchek = false;
  gaugeLabel = "Amperaje de la instalacion";
  totalConsumptionInWatts = "";
  totalConsumptionInKhw = "";
  totalConsumptionInAmps = "";
  deviceHealth = 0;
  selectedElapsedTime = "";
  healthText = "";
  @ViewChild("cicleChart") circleChart;
  @ViewChild("circleChartKilowatts") circleChartKilowatts;
  thresholdConfig = {
    0: { color: "green" },
    4000: { color: "orange" },
    7500.5: { color: "red" },
  };
  connectionName: any;
  subscription: Subscription;

  gaugeAppendText = "Watts";
  constructor(
    public awsAmplifyService: AwsAmplifyService,
    public loadingIndicator: LoadingController,
    public router: Router,
    public DynamoDBService: DynamoDBAPIService,
    public ToastController: ToastController,
    public messageService: MessageService,
    public alertController: AlertController,
    public energyService: EnergyService,
    private apolloClient: Apollo,
    public navController: NavController,
    public actionSheetController: ActionSheetController,
    public actrouter: ActivatedRoute,
    public networkService: NetworkService,
    public AwsSdkService: AwsSdkService,
    private modalController: ModalController
  ) {}

  /**  This method is launched when  the page is entered*/
  async ionViewDidEnter() {
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      this.connectionName = this.messageService.getConnectionName();
      const source = interval(10000);
      this.subscription = source.subscribe(
        async () =>
          await this.refreshConnectionDeviceReadings(this.connectionName)
      );
    } else {
      const toast = await this.ToastController.create({
        message: `Ha ocurrido un error de conexion, intentelo nuevamente`,
        duration: 2000,
      });
      toast.present();
    }
  }
  async ionViewDidLeave() {
    this.subscription && this.subscription.unsubscribe();
  }
  async dismissModal() {
    const modal = await this.modalController.create({
      component: DatesPage,
      cssClass: "my-custom-class",
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(), // Get the top-most ion-modal
    });
    return await modal.present();
  }
  ngOnInit(): void {
    // this.connectionName = this.messageService.getConnectionName();
  }
  ngOnDestroy(): void {}
  async logDevice(log: LogModel) {
    const url = environment.LoggerEndPoints.ULR;
    const loggerPath = environment.LoggerEndPoints.DatabaseLogger;
    const urlFullPath = `${url}` + `${loggerPath}`;
    await this.DynamoDBService.genericLogMethod(urlFullPath, log);
  }
  async options(url?: string) {
    this.router.navigate([url]);
  }
  goBack() {
    this.router.navigate(["/home-tabs/tabs/tab3"]);
  }
  async selectTime() {
    const actionSheet = await this.actionSheetController.create({
      header: "Seleccionar Lapso Temporal",
      buttons: [
        {
          text: "Este Año",
          handler: () => {
            this.showDetailChartInCurrentYear();
            this.selected_time = "Este Año";
          },
        },
        {
          text: "Este Mes",
          handler: () => {
            this.showDetailChartInCurrentMonth();
            this.selected_time = "Este Mes";
          },
        },
        {
          text: "Esta Semana",
          handler: () => {
            this.showDetailedChartInCurrentWeek();
            this.selected_time = "Esta Semana";
          },
        },
        {
          text: "Rango de fechas custom",
          handler: () => {
            this.showDetailedChartInCurrentWeek();
            this.selected_time = "Modal";
          },
        },
      ],
    });
    await actionSheet.present();
  }
  logScroll(event: any) {}
  doRefresh(event: any) {}
  /**
   * @function showModal
   */
  showModal() {}
  changeKhw(event: any) {
    if (this.showKlhw == true && this.selected_time == "Este Año") {
      this.showDetailChartInCurrentYearInKiloWatts();
    }
    if (this.showKlhw == false && this.selected_time == "Este Año") {
      this.showDetailChartInCurrentYear();
    }
    // este mes
    if (this.showKlhw === true && this.selected_time == "Este Mes") {
      this.showDetailChartInCurrentMonthKilowatts();
    }
    if (this.showKlhw == false && this.selected_time == "Este Mes") {
      this.showDetailChartInCurrentMonth();
    }
    if (this.showKlhw === true && this.selected_time == "Esta Semana") {
      this.showDetailChartInCurrentWeekKilowatts();
    }
    if (this.showKlhw == false && this.selected_time == "Esta Semana") {
      this.showDetailedChartInCurrentWeek();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingIndicator.create({
      message: "Cargando ...",
      spinner: "dots",
    });
    await this.loading.present();
  }
  /**
   * @function showLoading()
   * @author Claudio Raul Brito Mercedes
   * @description This function shows a loading indicator
   */
  async showLoading() {
    this.loading = await this.loadingIndicator.create({
      message: "Cargando ...",
      spinner: "dots",
    });
    await this.loading.present();
  }
  async showDetailedChartInCurrentWeek(Connection?: any) {
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      await this.showLoading();
      const urlRoot = environment.DynamoBDEndPoints.ULR;
      const urlEndpoint =
        environment.DynamoBDEndPoints.API_PATHS.Connections
          .ConnectionReadingsCurrentWeek;
      const ConnectionName = this.connectionName;
      const curr = new Date(); // get current date
      const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      const last = first + 6; // last day is the first day + 6

      const firstday = new Date(curr.setDate(first));
      firstday.setHours(0, 0, 0);

      const lastday = new Date(curr.setDate(last));
      lastday.setHours(24, 59, 59);

      const initialDateEpoch = Math.floor(firstday.getTime() / 1000);
      const finalDateEpoch = Math.floor(lastday.getTime() / 1000);
      const fullUrl = urlRoot + urlEndpoint;
      const postObject = {
        ConnectionName: this.connectionName,
        start: initialDateEpoch,
        end: finalDateEpoch,
      };
      let finalData = [];
      let ampsData = [];
      let KwhData = [];
      let mondayData = 0;
      let tuesdayData = 0;
      let thursdayData = 0;
      let wednesdayData = 0;
      let fridayData = 0;
      let saturdayData = 0;
      let sundayData = 0;
      let mondayDataAmps = 0;
      let tuesdayDataAmps = 0;
      let thursdayDataAmps = 0;
      let wednesdayDataAmps = 0;
      let fridayDataAmps = 0;
      let saturdayDataAmps = 0;
      let sundayDataAmps = 0;
      let mondayKwh = 0;
      let tuesdayKwh = 0;
      let thursdayKwh = 0;
      let wednesdayKwh = 0;
      let fridayKwh = 0;
      let saturdayKwh = 0;
      let sundayKwh = 0;
      const logger = new LogModel();
      logger.level = "INFO";
      logger.route = fullUrl;
      logger.action = "showDetailedChartInCurrentWeek";
      logger.timeStamp = new Date();
      logger.userName = "";
      await this.logDevice(logger);
      this.DynamoDBService.genericPostMethod(fullUrl, postObject).subscribe({
        next: async (response) => {
          this.deviceHealth = response?.health.health || 0;

          this.healthText = response?.health.message || "";
          mondayData = response?.usage[0].lunes.watts || 0;
          tuesdayData = response?.usage[0].martes.watts || 0;
          wednesdayData = response?.usage[0].miercoles.watts || 0;
          thursdayData = response?.usage[0].jueves.watts || 0;
          fridayData = response?.usage[0].viernes.watts || 0;
          saturdayData = response?.usage[0].sabado.watts || 0;
          sundayData = response?.usage[0].domingo.watts || 0;
          finalData.push(
            mondayData,
            tuesdayData,
            wednesdayData,
            thursdayData,
            fridayData,
            saturdayData,
            sundayData
          );
          mondayDataAmps = response?.usage[0].lunes.amperios || 0;
          tuesdayDataAmps = response?.usage[0].martes.amperios || 0;
          thursdayDataAmps = response?.usage[0].miercoles.amperios || 0;
          wednesdayDataAmps = response?.usage[0].jueves.amperios || 0;
          fridayDataAmps = response?.usage[0].viernes.amperios || 0;
          saturdayDataAmps = response?.usage[0].sabado.amperios || 0;
          sundayDataAmps = response?.usage[0].domingo.amperios || 0;

          ampsData.push(
            mondayDataAmps,
            tuesdayDataAmps,
            wednesdayDataAmps,
            thursdayDataAmps,
            fridayDataAmps,
            saturdayDataAmps,
            sundayDataAmps
          );
          //kwh
          mondayKwh = response?.usage[0].lunes.kwh || 0;
          tuesdayKwh = response?.usage[0].martes.kwh || 0;
          thursdayKwh = response?.usage[0].miercoles.kwh || 0;
          wednesdayKwh = response?.usage[0].jueves.kwh || 0;
          fridayKwh = response?.usage[0].viernes.kwh || 0;
          saturdayKwh = response?.usage[0].sabado.kwh || 0;
          sundayKwh = response?.usage[0].domingo.kwh || 0;
          KwhData.push(
            mondayKwh,
            tuesdayKwh,
            thursdayKwh,
            wednesdayKwh,
            fridayKwh,
            saturdayKwh,
            sundayKwh
          );
          const ctx = this.barChart.nativeElement;
          ctx.height = 200;
          ctx.width = 250;
          this.totalConsumptionInAmps = response?.usage[0].totalAmps || 0;
          this.totalConsumptionInKhw = response?.usage[0].totalKhw || 0;
          this.totalConsumptionInWatts = response?.usage[0].totalWatts || 0;
          this.bars = new Chart(ctx, {
            type: "line",
            data: {
              labels: [
                "Lunes",
                "Martes",
                "Miercoles",
                "Jueves",
                "Viernes",
                "Sabado",
                "Domingo",
              ],
              datasets: [
                {
                  label: "Cantidad Consumida en Kw/h",
                  data: KwhData,
                  backgroundColor: "rgba(0,0,0,0)", // array should have same number of elements as number of dataset
                  borderColor: "#05fcf8",
                  borderWidth: 3,
                  fill: true,
                },

                {
                  label: "Cantidad Consumida en Watts",
                  data: finalData,
                  backgroundColor: "rgba(0,0,0,0)", // array should have same number of elements as number of dataset
                  borderColor: "rgb(38, 194, 129)", // array should have same number of elements as number of dataset
                  borderWidth: 3,
                  fill: false,
                },
                {
                  label: "Cantidad Consumida en Amperios",
                  data: ampsData,
                  backgroundColor: "rgba(0,0,0,0)",
                  borderColor: "#dd1144",
                  borderWidth: 3,
                  fill: false,
                },
              ],
            },
            options: {
              responsive: true,
              title: {
                display: true,
                text: "Consumo durante esta semana",
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
                xAxes: [
                  {
                    barPercentage: 0.9,
                  },
                ],
              },
            },
          });
          const circle = this.circleChart.nativeElement;
          circle.height = 200;
          circle.width = 200;
          this.circle = new Chart(circle, {
            type: "pie",
            data: response?.dayNight,
            options: {
              title: {
                display: true,
                text: `Lecturas de Mes en curso de la ${this.connectionName}`,
              },
            },
          });
          const circleKilowatts = this.circleChartKilowatts.nativeElement;
          circleKilowatts.height = 200;
          circleKilowatts.width = 200;
          this.circleChartKilowatts = new Chart(circleKilowatts, {
            type: "pie",
            data: response?.dayNightKilowatts,
            options: {
              title: {
                display: true,
                text: `Lecturas del Mes en curso de la ${this.connectionName}`,
              },
            },
          });
        },
        error: async (error) => {
          this.loading.dismiss();
          const toast = await this.ToastController.create({
            message: `Ha ocurrido un error`,
            duration: 2000,
            position: "bottom",
            color: "dark",
          });
          toast.present();
        },
      });
      this.loading.dismiss();
    } else {
      const toast = await this.ToastController.create({
        message: `Ha ocurrido un error de conexion, intentelo nuevamente`,
        duration: 2000,
      });
      toast.present();
    }
  }
  async ionViewWillEnter() {
    this.showDetailedChartInCurrentWeek();
  }
  async turnOffDevice() {
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      for (let index = 0; index < this.devicesNames.length; index++) {
        const element = this.devicesNames[index];
        if (element == this.connectionName) {
          const remix = environment?.device_TOPICS.topicsArray.filter(
            (item) => item.connectionName == element
          );
          const topic = remix[0].turnOffTopics;
          const payload = "hello";
          const responses = (await this.AwsSdkService.publishMessage(
            topic,
            payload
          )) as any;
          if (responses?.response.error != null) {
            const toast = await this.ToastController.create({
              message: "Ha ocurrido un error desactivando el dispositivo",
              duration: 2000,
              position: "bottom",
              color: "dark",
            });
            toast.present();
            return;
          } else {
            this.turnedOff = true;
            const toast = await this.ToastController.create({
              message: `se ha desactivado el dispositivo ${element} de manera satisfactoria`,
              duration: 2000,
              position: "bottom",
              color: "dark",
            });
            toast.present();
          }
        }
      }
    } else {
      const toast = await this.ToastController.create({
        message: `Ha ocurrido un error de conexion, intentelo nuevamente`,
        duration: 2000,
      });
      toast.present();
    }
  }
  async turnOnDevice() {
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      for (let index = 0; index < this.devicesNames.length; index++) {
        const element = this.devicesNames[index];
        if (element == this.connectionName) {
          const remix = environment?.device_TOPICS.topicsArray.filter(
            (item) => item.connectionName == element
          );
          const topic = remix[0].turnOnTopics;
          const payload = "hello";
          const responses = (await this.AwsSdkService.publishMessage(
            topic,
            payload
          )) as any;
          if (responses?.response.error != null) {
            const toast = await this.ToastController.create({
              message: "Ha ocurrido un error desactivando el dispositivo",
              duration: 2000,
              position: "bottom",
              color: "dark",
            });
            toast.present();
            return;
          } else {
            this.turnedOff = true;
            const toast = await this.ToastController.create({
              message: `se ha desactivado el dispositivo ${element} de manera satisfactoria`,
              duration: 2000,
              position: "bottom",
              color: "dark",
            });
            toast.present();
          }
        }
      }
    } else {
      const toast = await this.ToastController.create({
        message: `Ha ocurrido un error de conexion, intentelo nuevamente`,
        duration: 2000,
      });
      toast.present();
    }
  }
  async showDetailChartInCurrentMonth() {
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      await this.showLoading();
      const urlRoot = environment.DynamoBDEndPoints.ULR;
      const urlEndpoint =
        environment.DynamoBDEndPoints.API_PATHS.Connections
          .ConnectionsGetAllDeviceReadingsByGivenMonth;
      const ConnectionName = this.connectionName;
      const curr = new Date();
      const firstsOfMonth = new Date(curr.getFullYear(), curr.getMonth(), 1);
      const lastOfMonth = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
      lastOfMonth.setHours(24, 59, 59);
      firstsOfMonth.setHours(0, 0, 0);
      const initialDateEpoch = Math.floor(firstsOfMonth.getTime() / 1000);
      const fullUrl =
        urlRoot + urlEndpoint;
      const logger = new LogModel();
      logger.level = "INFO";
      logger.route = fullUrl;
      logger.action = "showDetailChartInCurrentMonth";
      logger.timeStamp = new Date();
      logger.userName = "";
      let firstWeekDataKWH = 0;
      let secondWeekDataKWH = 0;
      let thirdWeekDataKWH = 0;
      let fourthWeekDataKWH = 0;
      let finalDataKWH = [];
      let firstWeekDataWatts = 0;
      let secondWeekDataWatts = 0;
      let thirdWeekDataWatts = 0;
      let fourthWeekDataWatts = 0;
      let finalDataWatts = [];
      let firstWeekDataAmps = 0;
      let secondWeekDataAmps = 0;
      let thirdWeekDataAmps = 0;
      let fourthWeekDataAmps = 0;
      let finalDataAmps = [];
      await this.logDevice(logger);
      const postObject ={
        day:initialDateEpoch,
        ConnectionName: this.connectionName,
      };
      debugger;
      this.DynamoDBService.genericPostMethod(fullUrl, postObject).subscribe({
        next: (data) => {
          const ctx = this.barChart.nativeElement;
          ctx.height = 200;
          ctx.width = 250;
          const dataset = data?.usage[0].detail.MonthDetails.TimeStamp || 0;
          this.totalConsumptionInWatts =
            data?.usage[0].detail.allMonthWatts || 0;
          this.totalConsumptionInAmps = data?.usage[0].detail.allMonthAmps || 0;
          this.totalConsumptionInKhw =
            data?.usage[0].detail.allMonthKiloWatts || 0;
            this.deviceHealth = data?.health.health || 0;
            this.healthText = data?.health.message || "";
          const month = new Date();
          firstWeekDataKWH =
          data?.usage[0].detail.MonthDetails.firstWeek.totalKwhPerWeek || 0;
          secondWeekDataKWH =
          data?.usage[0].detail.MonthDetails.secondWeek.totalKwhPerWeek || 0;
          thirdWeekDataKWH =
          data?.usage[0].detail.MonthDetails.thirdweek.totalKwhPerWeek || 0;
          fourthWeekDataKWH =
          data?.usage[0].detail.MonthDetails.fourthweek.totalKwhPerWeek || 0;
          finalDataKWH.push(
          firstWeekDataKWH,
          secondWeekDataKWH,
          thirdWeekDataKWH,
          fourthWeekDataKWH
        );
          firstWeekDataWatts =
          data?.usage[0].detail.MonthDetails.firstWeek.totalWattsPerWeek || 0;
          secondWeekDataWatts =
          data?.usage[0].detail.MonthDetails.secondWeek.totalWattsPerWeek ||
          0;
          thirdWeekDataWatts =
          data?.usage[0].detail.MonthDetails.thirdweek.totalWattsPerWeek || 0;
          fourthWeekDataWatts =
          data?.usage[0].detail.MonthDetails.fourthweek.totalWattsPerWeek ||
          0;
          finalDataWatts.push(
          firstWeekDataWatts,
          secondWeekDataWatts,
          thirdWeekDataWatts,
          fourthWeekDataWatts
        );
        // amperios
          firstWeekDataAmps =
          data?.usage[0].detail.MonthDetails.firstWeek.totalAmpsPerWeek || 0;
          secondWeekDataAmps =
          data?.usage[0].detail.MonthDetails.secondWeek.totalAmpsPerWeek || 0;
          thirdWeekDataAmps =
          data?.usage[0].detail.MonthDetails.thirdweek.totalAmpsPerWeek || 0;
          fourthWeekDataAmps =
          data?.usage[0].detail.MonthDetails.fourthweek.totalAmpsPerWeek || 0;
          finalDataAmps.push(
          firstWeekDataAmps,
          secondWeekDataAmps,
          thirdWeekDataAmps,
          fourthWeekDataAmps
        );
          month.toLocaleDateString("es-Es");
          this.bars = new Chart(ctx, {
            type: "line",
            data: {
              labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
              datasets: [
                {
                  label: "Cantidad Consumida en Kw/h",
                  data: finalDataKWH,
                  backgroundColor: "rgba(0,0,0,0)", // array should have same number of elements as number of dataset
                  borderColor: "#05fcf8",
                  borderWidth: 3,
                  fill: true,
                },
                {
                  label: "Cantidad Consumida en Watts",
                  data: finalDataWatts,
                  backgroundColor: "rgba(0,0,0,0)", // array should have same number of elements as number of dataset
                  borderColor: "rgb(38, 194, 129)",
                  borderWidth: 3,
                  fill: true,
                },
                {
                  label: "Cantidad Consumida en Amperios",
                  data: finalDataAmps,
                  backgroundColor: "rgba(0,0,0,0)", // array should have same number of elements as number of dataset
                  borderColor: "#dd1144",
                  borderWidth: 3,
                  fill: true,
                },
              ],
            },
            options: {
              responsive: true,
              title: {
                display: true,
                text: "Consumo durante este mes, por semanas",
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
                xAxes: [
                  {
                    barPercentage: 0.9,
                  },
                ],
              },
            },

          });
          const circle = this.circleChart.nativeElement;
          circle.height = 200;
          circle.width = 200;
          this.circle = new Chart(circle, {
            type: "pie",
            data: data?.dayNight,
            options:{
              responsive:true,
              title: {
                display: true,
                text:`Lecturas del mes en curso de la ${this.connectionName}`
              }
            }
          });
          const circleKilowatts = this.circleChartKilowatts.nativeElement;
          circleKilowatts.height = 200;
          circleKilowatts.width = 200;
          this.circleKwh = new Chart(circleKilowatts, {
            type: "pie",
            data: data?.dayNightKilowatts,
            options: {
              responsive: true,
              title: {
                display: true,
                text: `Lecturas del mes en curso de la ${this.connectionName}`
              },
            },
          });
        },
        error: async (error) => {
          this.loading.dismiss();
          const toast = await this.ToastController.create({
            message: `Ha ocurrido un error`,
            duration: 2000,
            position: "bottom",
            color: "dark",
          });
          toast.present();
        },
      });
      this.loading.dismiss();
    } else {
      const toast = await this.ToastController.create({
        message: `Ha ocurrido un error de conexion, intentelo nuevamente`,
        duration: 2000,
      });
      toast.present();
    }
  }
  /**
   *
   */
  async showDetailChartInCurrentYear() {
    let wattsData = [];
    let ampsData = [];
    let KHWData = [];
    //watts
    let Q1watts = 0;
    let Q2watts = 0;
    let Q3watts = 0;
    let Q4watts = 0;
    //kwh/h
    let Q1kwatts = 0;
    let Q2kwatts = 0;
    let Q3kwatts = 0;
    let Q4kwatts = 0;
    //amps
    let Q1Amps = 0;
    let Q2Amps = 0;
    let Q3Amps = 0;
    let Q4Amps = 0;
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      await this.showLoading();
      const urlRoot = environment.DynamoBDEndPoints.ULR;
      const urlEndpoint =
        environment.DynamoBDEndPoints.API_PATHS.Connections
          .ConnectionsGetConnectionYearly;
      const ConnectionName = this.connectionName;
      const fullUrl = urlRoot + urlEndpoint;
      const logger = new LogModel();
      logger.level = "INFO";
      logger.route = fullUrl;
      logger.action = "showDetailChartInCurrentYear";
      logger.timeStamp = new Date();
      logger.userName = "";
      const postObject = {
        ConnectionName: this.connectionName
      }
      await this.logDevice(logger);
      this.DynamoDBService.genericPostMethod(fullUrl, postObject).subscribe({
        next: async (response) => {
          const ctx = this.barChart.nativeElement;
          ctx.height = 200;
          ctx.width = 250;
          this.totalConsumptionInKhw = response?.usage[0].totalKwh || 0;
          this.totalConsumptionInAmps = response?.usage[0].totalAmps || 0;
          this.totalConsumptionInWatts = response?.usage[0].totalWatts || 0;
          this.deviceHealth = response?.health.health || 0;
          this.healthText = response?.health.message || "";
          //watts
          Q1watts = response?.usage[0].firstQuater.watts || 0;
          Q2watts = response?.usage[0].secondQuater.watts || 0;
          Q3watts = response?.usage[0].thirdQuater.watts || 0;
          Q4watts = response?.usage[0].FourthQuater.watts || 0;
          wattsData.push(Q1watts, Q2watts, Q3watts, Q4watts);
          //kwh/h 
          Q1kwatts = response?.usage[0].firstQuater.kilowatts || 0;
          Q2kwatts = response?.usage[0].secondQuater.kilowatts || 0;
          Q3kwatts = response?.usage[0].thirdQuater.kilowatts || 0;
          Q4kwatts = response?.usage[0].FourthQuater.kilowatts || 0;
          KHWData.push(Q1kwatts, Q2kwatts, Q3kwatts, Q4kwatts);
          //amps

          Q1Amps = response?.usage[0].firstQuater.amps || 0;
          Q2Amps = response?.usage[0].secondQuater.amps || 0;
          Q3Amps = response?.usage[0].thirdQuater.amps || 0;
          Q4Amps = response?.usage[0].FourthQuater.amps || 0;
          ampsData.push(Q1Amps, Q2Amps, Q3Amps, Q4Amps);
          this.bars = new Chart(ctx, {
            type: "line",
            data: {
              labels: ["(ene-mar)", "(abr-jun)", "(jul-sept)", "(oct-dic)"],
              datasets: [
                {
                  label: "Cantidad Consumida en Watts",
                  data: wattsData,
                  backgroundColor: "rgba(0,0,0,0)", // array should have same number of elements as number of dataset
                  borderColor: "rgb(38, 194, 129)",
                  borderWidth: 3,
                  fill: true,
                },
                {
                  label: "Cantidad Consumida en Kw/h",
                  data: KHWData,
                  backgroundColor: "rgba(0,0,0,0)", // array should have same number of elements as number of dataset
                  borderColor: "#05fcf8",
                  borderWidth: 3,
                  fill: true,
                },
                {
                  label: "Cantidad Consumida en Amperios",
                  data: ampsData,
                  backgroundColor: "rgba(0,0,0,0)", // array should have same number of elements as number of dataset
                  borderColor: "#dd1144",
                  borderWidth: 3,
                  fill: true,
                }
              ],
            },
            options: {
              responsive: true,
              title: {
                display: true,
                text: "Consumo durante este año",
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
                xAxes: [
                  {
                    barPercentage: 0.9,
                  },
                ],
              },
            },
          });
          const circle = this.circleChart.nativeElement;
          circle.height = 200;
          circle.width = 200;
          this.circle = new Chart(circle, {
            type: "pie",
            data: response?.dayNight,
            title: {
              responsive: true,
              display: true,
              text: `Lecturas del mes en curso de la ${this.connectionName}`
            },
          });
          const circleKilowatts = this.circleChartKilowatts.nativeElement;
          circleKilowatts.height = 200;
          circleKilowatts.width = 200;
          this.circleKwh = new Chart(circleKilowatts, {
            type: "pie",
            data: response?.dayNightKilowatts,
            options: {
              responsive: true,
              title: {
                display: true,
                text: `Lecturas del mes en curso de la ${this.connectionName}`
              },
            },
          });
          this.loading.dismiss();
        },
        error: async (error) => {
          this.loading.dismiss();
          const toast = await this.ToastController.create({
            message: `Ha ocurrido un error`,
            duration: 2000,
            position: "bottom",
            color: "dark",
          });
          toast.present();
        },
      });

    } else {
      const toast = await this.ToastController.create({
        message: `Ha ocurrido un error de conexion, intentelo nuevamente`,
        duration: 2000,
      });
      toast.present();
    }
  }
  /**
   *
   * @param ConnectionN ConnectionName
   */
  async showDetailChartInCurrentYearInKiloWatts(ConnectionN?) {
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      await this.presentLoading();
      const urlRoot = environment.DynamoBDEndPoints.ULR;
      const urlEndpoint =
        environment.DynamoBDEndPoints.API_PATHS.Connections
          .ConnectionsGetConnectionYearly;
      const ConnectionName = this.connectionName;
      const fullUrl = urlRoot + urlEndpoint + `/${ConnectionName}`;
      this.DynamoDBService.genericGetMethods(fullUrl).subscribe({
        next: async (response) => {
          this.deviceHealth = response?.health.health || 0;
          this.healthText = response?.health.message || "";
          const ctx = this.barChart.nativeElement;
          ctx.height = 200;
          ctx.width = 250;
          this.totalConsumptionInKhw = response?.usage[0].totalKwh || 0;
          this.totalConsumptionInAmps = response?.usage[0].totalAmps || 0;
          this.totalConsumptionInWatts = response?.usage[0].totalWatts || 0;
          this.bars = new Chart(ctx, {
            type: "line",
            data: {
              labels: [""],
              datasets: [
                {
                  label: "Valor en Kilowatts",
                  data: response?.usage[0].KiloWattsTimeStamp || [
                    { x: "0", y: "0" },
                  ],
                  fill: true,
                },
              ],
            },
            options: {
              responsive: true,
              title: {
                display: true,
                text: "Consumo durante este año",
              },
            },
            scales: {
              xAxes: [
                {
                  type: "time",
                  display: true,
                  distribution: "series",
                  time: {
                    unit: "year",
                    displayFormats: { year: "YYYY" },
                    min: "1970",
                    max: "2022",
                  },
                },
              ],
            },
          });
          const circle = this.circleChart.nativeElement;
          circle.height = 200;
          circle.width = 200;
          this.circle = new Chart(circle, {
            type: "pie",
            data: response?.dayNight,
          });
        },
        error: async (error) => {
          this.loading.dismiss();
          const toast = await this.ToastController.create({
            message: `Ha ocurrido un error`,
            duration: 2000,
            position: "bottom",
            color: "dark",
          });
          toast.present();
        },
      });
      this.loading.dismiss();
    } else {
      const toast = await this.ToastController.create({
        message: `Ha ocurrido un error de conexion, intentelo nuevamente`,
        duration: 2000,
      });
      toast.present();
    }
  }

  async showDetailChartInCurrentMonthKilowatts(Connection?) {
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      await this.presentLoading();
      const urlRoot = environment.DynamoBDEndPoints.ULR;
      const urlEndpoint =
        environment.DynamoBDEndPoints.API_PATHS.Connections
          .ConnectionsGetAllDeviceReadingsByGivenMonth;
      const ConnectionName = this.connectionName;
      const curr = new Date();
      const firstsOfMonth = new Date(curr.getFullYear(), curr.getMonth(), 1);
      const lastOfMonth = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
      lastOfMonth.setHours(24, 59, 59);
      firstsOfMonth.setHours(0, 0, 0);
      const initialDateEpoch = Math.floor(firstsOfMonth.getTime() / 1000);
      const fullUrl =
        urlRoot + urlEndpoint + `/${initialDateEpoch}/${ConnectionName}`;
      this.DynamoDBService.genericGetMethods(fullUrl).subscribe({
        next: (data) => {
          const ctx = this.barChart.nativeElement;
          ctx.height = 200;
          ctx.width = 250;
          const dataset = data.usage[0].detail.MonthDetails.kwhTimesTamp || 0;
          this.totalConsumptionInWatts =
            data.usage[0].detail.allMonthWatts || 0;
          this.totalConsumptionInAmps = data.usage[0].detail.allMonthAmps || 0;
          this.totalConsumptionInKhw =
            data.usage[0].detail.allMonthKiloWatts || 0;
          this.deviceHealth = data?.health.health || 0;
          this.healthText = data?.health.message || "";
          const month = new Date();

          month.toLocaleDateString("es-Es");
          this.bars = new Chart(ctx, {
            type: "line",
            data: {
              labels: [""],
              datasets: [
                {
                  label: "Valor en Kilowatts",
                  data: dataset,
                  fill: true,
                },
              ],
            },
            options: {
              responsive: true,
              title: {
                display: true,
                text: "Consumo durante este mes",
              },
            },
            scales: {
              xAxes: [
                {
                  type: "time",
                  display: true,
                  distribution: "series",
                  time: {
                    unit: "year",
                    displayFormats: { year: "YYYY" },
                    min: "1970",
                    max: "2022",
                  },
                },
              ],
            },
          });
        },
      });
      this.loading.dismiss();
    } else {
      const toast = await this.ToastController.create({
        message: `Ha ocurrido un error de conexion, intentelo nuevamente`,
        duration: 2000,
      });
      toast.present();
    }
  }
  async showDetailChartInCurrentWeekKilowatts(Connection?) {
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      await this.showLoading();
      const urlRoot = environment.DynamoBDEndPoints.ULR;
      const urlEndpoint =
        environment.DynamoBDEndPoints.API_PATHS.Connections
          .ConnectionReadingsCurrentWeek;
      const ConnectionName = this.connectionName;
      const curr = new Date(); // get current date
      const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      const last = first + 6; // last day is the first day + 6

      const firstday = new Date(curr.setDate(first));
      firstday.setHours(0, 0, 0);

      const lastday = new Date(curr.setDate(last));
      lastday.setHours(24, 59, 59);

      const initialDateEpoch = Math.floor(firstday.getTime() / 1000);
      const finalDateEpoch = Math.floor(lastday.getTime() / 1000);
      const fullUrl =
        urlRoot +
        urlEndpoint +
        `/${initialDateEpoch}/${finalDateEpoch}/${ConnectionName}`;
      this.DynamoDBService.genericGetMethods(fullUrl).subscribe({
        next: (data) => {
          const ctx = this.barChart.nativeElement;
          ctx.height = 200;
          ctx.width = 250;
          this.deviceHealth = data?.health.health || 0;
          this.healthText = data?.health.message || "";
          const dataset = data?.usage[0].Timestamp || [];
          this.totalConsumptionInAmps = data?.usage[0].totalAmps || 0;
          this.totalConsumptionInKhw = data?.usage[0].totalKhw || 0;
          this.totalConsumptionInWatts = data?.usage[0].totalWatts || 0;
          const month = new Date();

          if (dataset == []) {
            dataset.push({ t: new Date().toISOString(), y: 0 });
          }
          month.toLocaleDateString("es-Es");
          this.bars = new Chart(ctx, {
            type: "line",
            data: {
              labels: [""],
              datasets: [
                {
                  label: "Valor en Kilowatts",
                  data: dataset,
                  fill: true,
                },
              ],
            },
            options: {
              responsive: true,
              title: {
                display: true,
                text: "Consumo durante esta semana",
              },
            },
            scales: {
              xAxes: [
                {
                  type: "time",
                  display: true,
                  distribution: "series",
                  time: {
                    unit: "year",
                    displayFormats: { year: "YYYY" },
                    min: "1970",
                    max: "2022",
                  },
                },
              ],
            },
          });
          const circle = this.circleChart.nativeElement;
          circle.height = 200;
          circle.width = 200;
          this.circle = new Chart(circle, {
            type: "pie",
            data: data?.dayNight,
          });
        },
        error: async (error) => {
          this.loading.dismiss();
          const toast = await this.ToastController.create({
            message: `Ha ocurrido un error`,
            duration: 2000,
            position: "bottom",
            color: "dark",
          });
          toast.present();
        },
      });
      this.loading.dismiss();
    } else {
      const toast = await this.ToastController.create({
        message: `Ha ocurrido un error de conexion, intentelo nuevamente`,
        duration: 2000,
      });
      toast.present();
    }
  }
  /**
   * @function refreshConnectionDeviceReadings
   * @param ConnectionName the Device ConnectionName
   */
  public async refreshConnectionDeviceReadings(ConnectionName?) {
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      const beginning = Math.floor(Date.now() / 1000);
      const logger = new LogModel();
      logger.level = "INFO";
      logger.route = "GQL";
      logger.action = "refreshConnectionDeviceReadings";
      logger.timeStamp = new Date();
      logger.userName = "";
      await this.logDevice(logger);
      try {
        if (this.connectionName == DevicesEnum.DeviceOne) {
          const connectionNumber = 1;
          this.querySubscription = this.apolloClient
            .watchQuery<any>({
              query: gql`
          {
            Ct1_readings(timeStamp:${beginning},connectionName:${connectionNumber}){
              CT1_Amps,
              CT1_Watts,
              CT1_Status,
              Name,
            }
          }
          `,
            })
            .valueChanges.subscribe(async ({ data, loading }) => {
              if (!loading) {
                if (Object.keys(data).length > 0) {
                  if (
                    data.Ct1_readings.CT1_Status == null ||
                    data.Ct1_readings.CT1_Status == undefined
                  ) {
                    const toast = await this.ToastController.create({
                      message: `la ${ConnectionName} No esta conectado`,
                      duration: 2000,
                      position: "bottom",
                      color: "dark",
                    });
                    toast.present();
                  } else {
                    // this.connectionsRealtimeDataModel.Name = data.Name;
                    if (data.Ct1_readings.Name == this.connectionName) {
                      this.connectionsRealtimeDataModel.CT1_Amps =
                        data.Ct1_readings.CT1_Amps;
                      this.connectionsRealtimeDataModel.CT1_Watts =
                        data.Ct1_readings.CT1_Watts;
                      this.connectionsRealtimeDataModel.CT1_Status =
                        data.Ct1_readings.CT1_Status;
                      this.connectionsRealtimeDataModel.Name =
                        data.Ct1_readings.Name;
                    } else {
                      const toast = await this.ToastController.create({
                        message: `Data de la conexion no encontrada`,
                        duration: 2000,
                        position: "bottom",
                        color: "dark",
                      });
                      toast.present();
                    }
                  }
                }
              }
            });
        }
        if (this.connectionName == DevicesEnum.DeviceTwo) {
          const connectionNumber = 2;
          this.querySubscription = this.apolloClient
            .watchQuery<any>({
              query: gql`
          {
            Ct1_readings(timeStamp:${beginning},connectionName:${connectionNumber}){
              CT1_Amps,
              CT1_Watts,
              CT1_Status,
              Name,
            }
          }
          `,
            })
            .valueChanges.subscribe(async ({ data, loading }) => {
              if (!loading) {
                if (Object.keys(data).length > 0) {
                  if (
                    data.Ct1_readings.CT1_Status == null ||
                    data.Ct1_readings.CT1_Status == undefined
                  ) {
                    const toast = await this.ToastController.create({
                      message: `la ${ConnectionName} No esta conectado`,
                      duration: 2000,
                      position: "bottom",
                      color: "dark",
                    });
                    toast.present();
                  } else {
                    // this.connectionsRealtimeDataModel.Name = data.Name;
                    if (data.Ct1_readings.Name == this.connectionName) {
                      this.connectionsRealtimeDataModel.CT1_Amps =
                        data.Ct1_readings.CT1_Amps;
                      this.connectionsRealtimeDataModel.CT1_Watts =
                        data.Ct1_readings.CT1_Watts;
                      this.connectionsRealtimeDataModel.CT1_Status =
                        data.Ct1_readings.CT1_Status;
                      this.connectionsRealtimeDataModel.Name =
                        data.Ct1_readings.Name;

                      console.log(this.connectionsRealtimeDataModel);
                    } else {
                      const toast = await this.ToastController.create({
                        message: `Data de la conexion no encontrada`,
                        duration: 2000,
                        position: "bottom",
                        color: "dark",
                      });
                      toast.present();
                    }
                  }
                }
              }
            });
        }
        if (this.connectionName == DevicesEnum.DeviceThree) {
          const connectionNumber = 3;
          this.querySubscription = this.apolloClient
            .watchQuery<any>({
              query: gql`
          {
            Ct1_readings(timeStamp:${beginning},connectionName:${connectionNumber}){
              CT1_Amps,
              CT1_Watts,
              CT1_Status,
              Name,
            }
          }
          `,
            })
            .valueChanges.subscribe(async ({ data, loading }) => {
              if (!loading) {
                if (Object.keys(data).length > 0) {
                  if (
                    data.Ct1_readings.CT1_Status == null ||
                    data.Ct1_readings.CT1_Status == undefined
                  ) {
                    const toast = await this.ToastController.create({
                      message: `la ${ConnectionName} No esta conectado`,
                      duration: 2000,
                      position: "bottom",
                      color: "dark",
                    });
                    toast.present();
                  } else {
                    // this.connectionsRealtimeDataModel.Name = data.Name;
                    if (data.Ct1_readings.Name == this.connectionName) {
                      this.connectionsRealtimeDataModel.CT1_Amps =
                        data.Ct1_readings.CT1_Amps;
                      this.connectionsRealtimeDataModel.CT1_Watts =
                        data.Ct1_readings.CT1_Watts;
                      this.connectionsRealtimeDataModel.CT1_Status =
                        data.Ct1_readings.CT1_Status;
                      this.connectionsRealtimeDataModel.Name =
                        data.Ct1_readings.Name;

                      console.log(this.connectionsRealtimeDataModel);
                    } else {
                      const toast = await this.ToastController.create({
                        message: `Data de la conexion no encontrada`,
                        duration: 2000,
                        position: "bottom",
                        color: "dark",
                      });
                      toast.present();
                    }
                  }
                }
              }
            });
        }
      } catch (error) {
        const logger = new LogModel();
        logger.level = "ERROR";
        logger.route = "GQL";
        logger.action = "refreshConnectionDeviceReadings";
        logger.timeStamp = new Date();
        logger.userName = "";
        logger.logError = error;
        logger.timeStamp.toDateString();
        await this.logDevice(logger);
        const toast = await this.ToastController.create({
          message: `Ha ocurrido un error`,
          duration: 2000,
          position: "bottom",
          color: "dark",
        });
        toast.present();
      }
    } else {
      const toast = await this.ToastController.create({
        message: `Ha ocurrido un error de conexion, intentelo nuevamente`,
        duration: 2000,
      });
      toast.present();
    }
  }
}
