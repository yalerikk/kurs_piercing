import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

import "../styles/services.css";

const ServiceBar = observer(() => {
  const { service } = useContext(Context);

  return (
    <div className="service-name-bar list-group">
      {service.serviceName.map((service_name) => (
        <button
          key={service_name.id}
          type="button"
          className={`service-name-bar-item list-group-item list-group-item-action ${
            service_name.id === service.selectedServiceName?.id ? "active" : ""
          }`}
          onClick={() => service.setSelectedServiceName(service_name)}
          aria-current={
            service_name.id === service.selectedServiceName?.id
              ? "true"
              : "false"
          }
        >
          {service_name.name}
        </button>
      ))}
    </div>
  );
});

export default ServiceBar;
