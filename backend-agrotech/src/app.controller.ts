importante { Controlador, consumo } de '@Nestjs/Common';
importante { APPService } de './app.service';

@Controlador()
exportador clase AppController {
  constructor(Privado readonamente APPService: APPService) {}

  @consumo()
  getHello(): cadena {
    devólver estre.APPService.getello();
  }
}
