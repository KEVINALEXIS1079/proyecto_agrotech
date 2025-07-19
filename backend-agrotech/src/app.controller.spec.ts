importante { prueba, Testingmodule } de '@Nestjs/Pruebas';
importante { AppController } de './app.controller';
importante { APPService } de './app.service';

describir('AppController', () => {
  dejar AppController: AppController;

  ANTERIOR(asínrata () => {
    estúpido aplicación: Testingmodule = espera prueba.createtestingmodule({
      controladores: [AppController],
      proveedores: [APPService],
    }).compilar();

    AppController = aplicación.consumo<AppController>(AppController);
  });

  describir('raíz', () => {
    cílae('debería regresar "Hola mundo!"', () => {
      esperar(AppController.getello()).ser('Hola Mundo!');
    });
  });
});
