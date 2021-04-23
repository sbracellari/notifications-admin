package edu.oakland.notificationsadmin;

import org.apereo.portal.soffit.renderer.SoffitApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan({"edu.oakland.soffit.auth", "edu.oakland.notificationsadmin"})
@SoffitApplication
@SpringBootApplication
public class NotificationsAdminApplication {
  public static void main(String[] args) {
    SpringApplication.run(NotificationsAdminApplication.class, args);
  }
}
