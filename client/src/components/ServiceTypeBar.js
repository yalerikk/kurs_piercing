import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

import "../styles/services.css";

const ServiceTypeBar = observer(() => {
  const { service } = useContext(Context);

  return (
    <ul className="service-type-bar list-group list-group-horizontal">
      {service.serviceTypeName.map((service_type_name) => (
        <li
          key={service_type_name.id}
          className={`service-type-bar-item list-group-item ${
            service_type_name.id === service.selectedServiceTypeName?.id
              ? "active"
              : ""
          }`}
          onClick={() => service.setSelectedServiceTypeName(service_type_name)}
          aria-current={
            service_type_name.id === service.selectedServiceTypeName?.id
              ? "true"
              : "false"
          }
        >
          {service_type_name.name}
        </li>
      ))}
    </ul>
  );
});

export default ServiceTypeBar;
