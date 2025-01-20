import { makeAutoObservable } from "mobx";

export default class ServiceStore {
  constructor() {
    this._serviceNames = [
      { id: 1, name: "Септум" },
      { id: 2, name: "Нострил" },
      { id: 3, name: "Мочка" },
      { id: 4, name: "Хеликс" },
    ];

    this._serviceTypeNames = [
      { id: 1, name: "Нос" },
      { id: 2, name: "Ушки" },
      { id: 3, name: "Губы" },
      { id: 4, name: "Рот" },
      { id: 5, name: "Тело" },
      { id: 6, name: "Бровь" },
      { id: 7, name: "Другое" },
    ];

    this._services = [
      {
        id: 1,
        name: "Септум",
        description:
          "это прокол носовой перегородки, выполняемый через тонкую ткань, что минимизирует боль и позволяет носить различные украшения, подчеркивая вашу индивидуальность",
        price: 50,
        photo: "services/4b5ada35-c92c-430d-afda-5ed67f3f04ac.jpg",
        createdAt: "2024-11-29T20:59:19.641Z",
        updatedAt: "2024-12-01T00:14:33.562Z",
        service_type_id: 1,
      },
      {
        id: 2,
        name: "Нострил",
        description:
          "прокол хряща, пирсинг крыла носа, один из самых популярных ;)",
        price: 50,
        photo: "services/28257969-554f-41be-86f6-483efd5741dc.jpg",
        createdAt: "2024-11-30T16:22:08.155Z",
        updatedAt: "2024-12-01T00:15:07.911Z",
        service_type_id: 1,
      },
      {
        id: 3,
        name: "Мочка",
        description:
          "прокол мочки уха быстро заживает благодаря отличному кровоснабжению, сопровождается минимальным дискомфортом и стал традицией среди девушек и парней",
        price: 40,
        photo: "services/74bf3804-d23b-45af-9909-4dd5e123fffa.jpg",
        createdAt: "2024-11-30T17:12:38.381Z",
        updatedAt: "2024-12-01T00:15:35.256Z",
        service_type_id: 2,
      },
      {
        id: 4,
        name: "Хеликс",
        description:
          "один из самых популярных видов пирсинга, позволяющий создавать разнообразные комбинации украшений, подходящий практически для всех анатомий уха",
        price: 50,
        photo: "services/1cebb97d-d75d-47b3-b545-43f8fe772051.jpg",
        createdAt: "2024-11-30T17:14:36.925Z",
        updatedAt: "2024-12-01T00:15:51.981Z",
        service_type_id: 2,
      },
    ];

    this._selectedServiceName = this._serviceNames[0];
    this._selectedServiceTypeName = this._serviceTypeNames[0];

    // применяем MobX для автоматического отслеживания изменений
    makeAutoObservable(this);
  }

  setServiceNames(service_names) {
    this._serviceNames = service_names; // установить информацию об услугах
  }
  setServiceTypeNames(service_type_names) {
    this._serviceTypeNames = service_type_names; // установить информацию об услугах
  }
  setServices(services) {
    this._services = services; // Устанавливаем значение
  }
  setSelectedServiceName(service_name) {
    this._selectedServiceName = service_name; // установить информацию об услугах
  }
  setSelectedServiceTypeName(service_type_name) {
    this._selectedServiceTypeName = service_type_name; // установить информацию об услугах
  }

  get serviceName() {
    return this._serviceNames; // возвращает информацию об услугах
  }
  get serviceTypeName() {
    return this._serviceTypeNames; // возвращает информацию об услугах
  }
  get services() {
    return this._services; // Возвращаем значение через геттер
  }
  get selectedServiceName() {
    return this._selectedServiceName; // возвращает информацию об услугах
  }
  get selectedServiceTypeName() {
    return this._selectedServiceTypeName; // возвращает информацию об услугах
  }
}
