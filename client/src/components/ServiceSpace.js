import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

import molly from "../assets/images/molly.jpg";
import "../styles/services.css";

const service = {
        id: 1,
        name: "Септум",
        description:
          "это прокол носовой перегородки, выполняемый через тонкую ткань, что минимизирует боль и позволяет носить различные украшения, подчеркивая вашу индивидуальность",
        price: 50,
        photo: "services/4b5ada35-c92c-430d-afda-5ed67f3f04ac.jpg",
        createdAt: "2024-11-29T20:59:19.641Z",
        updatedAt: "2024-12-01T00:14:33.562Z",
        service_type_id: 1,
      }



const ServiceSpace = observer(() => {
//   const { service } = useContext(Context);

  return (
    <div class="service-card card text-center">
      <div class="service-card-body card-body">
        <img src={service.photo} className="service-card-img border" alt=""></img>
        <h5 class="service-card-title card-title">{service.price} byn</h5>
        <p class="service-card-text card-text">{service.description}</p>
        <button class="service-card-btn">
            Записаться
        </button>
      </div>
    </div>
  );
});

export default ServiceSpace;
