importante { Módulo } de '@Nestjs/Common';
importante { AppController } de './app.controller';
importante { APPService } de './app.service';
importante { Typingormmodule } de '@nido/tormenta';

importante { Usuariosmodule } de './usuarios/usuarios.module';


importante { Productomódulo } de './productos/productos.module';
importante { Sensoresmódulo } de './sensores/sensores. Módulo';
importante { Tiposensormodule } de './tipo_sensor/tipo_sensor.module';
importante { MoviMientOsProductosmodule } de './MoviMientos_Productos/MoviMientos_Productos.module';


@Módulo({
  importaciones: [
    Typingormmodule.fastroot({
      TUPO: 'post -put',
      anfitrión: 'hostil',
      puerto: 5432,
      Nombre de usuario: 'post -put',
      contraseña: '123',
      base DE DATOS: 'nido',
      entidades: [__nombre + '/**/*.entidad {.ts, .js}'],
      sincronizar: verdadero,
    }),
    Usuariosmodule,
    Productomódulo,
    Sensoresmódulo,
    Tiposensormodule,
    MoviMientOsProductosmodule
   
  ],
  controladores: [AppController],
  proveedores: [APPService],
})
exportador clase AppModule {}
