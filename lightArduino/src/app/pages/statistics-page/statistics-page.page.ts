import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  LoadingController,
  AlertController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { Apollo } from "apollo-angular";
import { AwsAmplifyService } from "src/app/data-services/aws-amplify.service";
import { DynamoDBAPIService } from "src/app/data-services/dynamo-db-api.service";
import { EnergyService } from "src/app/data-services/energyService/energy.service";
import { MessageService } from "src/app/data-services/messageService/message.service";
import { RelaysModel } from "src/app/models/relays-model";
import { environment } from "src/environments/environment";
import { Observable, of } from "rxjs";
import { NetworkService,ConnectionStatus } from "src/app/data-services/network.service";
@Component({
  selector: "app-statistics-page",
  templateUrl: "./statistics-page.page.html",
  styleUrls: ["./statistics-page.page.scss"],
})
export class StatisticsPagePage implements OnInit {
  relaysModel: RelaysModel[] = [];
  loading: any;
  relaysList = [];
  currentUserError: any;
  relays: Observable<RelaysModel[]>;
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
    public networkService: NetworkService,
  ) {}

  ngOnInit() {}
 async doRefresh(event) {
  if (
    this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
  ) {
    await this.validateLoggedUser();
  }else {
    const alert = await this.alertController.create({
      message:
        "su dispositivo no esta conectado a la red internet, por favor debe conectarse a la red de internet",
    });
    alert.present();
  }

  }
  async ionViewDidEnter() {
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      this.validateLoggedUser();
    }else {
      const alert = await this.alertController.create({
        message:
          "su dispositivo no esta conectado a la red internet, por favor debe conectarse a la red de internet",
      });
      alert.present();
    }

  }
  /**
   * this method presents a loading indicator
   */
  async presentLoading() {
    this.loading = await this.loadingIndicator.create({
      message: "Cargando ...",
      spinner: "dots",
    });
    await this.loading.present();
  }
  async redirectToConnectionsRelay(relay: any) {
    this.messageService.setConnectionName(relay.Name);
    this.router.navigate(['/connection-one-tabs/connection-one-tab/tab1']);
  }
  async loadAllRelays(userEmail: any) {
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      const url = environment.DynamoBDEndPoints.ULR;
      const urlPath = environment.DynamoBDEndPoints.API_PATHS.getDeviceRelays;
      const urlFullPath = `${url}` + `${urlPath}` + `${userEmail}`;
      let defaultArray:Array<any> = [];
      this.DynamoDBService.genericGetMethods(urlFullPath).subscribe({
        next: async (data) => {
          if (data != null || data != undefined || data.data != undefined) {
            if (data.error == true) {
              const alert = await this.alertController.create({
                header: "Advertencia",
                subHeader: "no tiene conexiones registradas",
                message: data.message,
                buttons: [
                  {
                    text: "Aceptar",
                  },
                ],
              });
              await alert.present();
            } else {
              if (data.data.length > 0) {
                this.relaysList = data.data;

                let relays$: Observable<Array<any>>;
                for (let index = 0; index < this.relaysList.length; index++) {
                  this.relaysModel.push(this.relaysList[index]);
                  
                }
                defaultArray = this.dataMapped(this.relaysModel);
                relays$ = of(defaultArray);
                this.relays = relays$;
                this.loading.dismiss();
              }
            }
          } else {
            const alert = await this.alertController.create({
              header: "Advertencia",
              subHeader: "no tiene dispositivos registrados",
              message:
                "es necesario que registre un dispositivo para acceder a esta pagina",
              buttons: [
                {
                  text: "Aceptar",
                  handler: async () => {
                    await this.singOut();
                  },
                },
              ],
            });
            await alert.present();
          }
        },
        error: async (error) => {
          const toast = await this.ToastController.create({
            message: "Ha ocurrido un error, ingrese nuevamente al sistema",
            duration: 2000,
            position: "bottom",
            color: "dark",
          });
          toast.present();
        },
        complete: () => {

        },
      });
    }else{
      const alert = await this.alertController.create({
        message:
          "su dispositivo no esta conectado a la red internet, por favor debe conectarse a la red de internet",
      });
      alert.present();
    }

  }
  redirectToRegisterDevicePage() {
    this.navController.navigateBack("/register-device");
  }
  /**
   * @method singOut
   */
  async singOut() {
    await this.presentLoading();
    this.awsAmplifyService
      .singOut()
      .then((result) => {
        if (result != undefined) {
        }
      })
      .catch(() => {})
      .finally(() => {
        this.loading.dismiss();
      });
  }
  async openPage(page) {}
  async validateLoggedUser() {
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      await this.presentLoading();
      this.awsAmplifyService
        .getCurrentUser()
        .then(async (result) => {
          if (result != undefined) {
            this.loadAllRelays(result?.attributes?.email);
          } else {
            this.currentUserError = this.awsAmplifyService.getErrors();
            const toast = await this.ToastController.create({
              message: "Ha ocurrido un error, ingrese nuevamente al sistema",
              duration: 2000,
              position: "bottom",
              color: "dark",
            });
            toast.present();
          }
        })
        .catch(async (error) => {
          const toast = await this.ToastController.create({
            message: "Ha ocurrido un error, ingrese nuevamente al sistema",
            duration: 2000,
            position: "bottom",
            color: "dark",
          });
          toast.present();
        })
        .finally(() => {
          this.loading.dismiss();
        });
    }
    else {
      const alert = await this.alertController.create({
        message:
          "su dispositivo no esta conectado a la red internet, por favor debe conectarse a la red de internet",
      });
      alert.present();
    }

  }
  /**
   * 
   * @param array array that will be mapped
   * @returns Array<any>
   */
  private dataMapped(array:any[]){
    if (array === null) {
      return [];
      
    }
    return array.map((item) =>({
      Name: item.Name
    }));
  }
}
