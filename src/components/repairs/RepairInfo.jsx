import styles from "../../styles/Repairs.module.css";

const RepairInfo = () => {
    return (
        <div>
            <table className={styles.repairInfoTable}>
                <thead>
                    <tr>
                        <th>Бренд</th>
                        <th>Сервіс</th>
                        <th>Адреса</th>
                        <th>Оплата</th>
                        <th>Телефон</th>
                        <th>Сайт</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                        <td>Apple</td>
                        <td></td>
                        <td>        
                        </td>
                        <td></td>
                        <td></td>
                        <td><a href="" target="_blank" rel="noopener noreferrer"></a></td>
                    </tr>
                    <tr>
                        <td>Doogee</td>
                        <td></td>
                        <td>
                        </td>
                        <td></td>
                        <td></td>
                        <td><a href="" target="_blank" rel="noopener noreferrer"></a></td>
                    </tr>
                    <tr>
                        <td>Motorola</td>
                        <td>ТОВ MTI Сервіс</td>
                        <td>
                            ЕДРПОУ - 39554115, м.Київ, вул. Білоруська 26 <br />
                        </td>
                        <td>отримувач, безготівка</td>
                        <td>0966302508</td>
                        <td><a href="https://samsungservice.com.ua/" target="_blank" rel="noopener noreferrer">samsungservice.com.ua</a></td>
                    </tr>
                    <tr>
                        <td>Oppo</td>
                        <td></td>
                        <td>
                        </td>
                        <td></td>
                        <td></td>
                        <td><a href="" target="_blank" rel="noopener noreferrer"></a></td>
                    </tr>
                    <tr>
                        <td>Oscal</td>
                        <td>
                            Elffix - ФОП Гайдар Олександр Іванович код РНОКПП
                            3001602971
                        </td>
                        <td>
                            Отримувач: Колінько Карина Володимирівна -
                            0956182101 <br />
                            м.Київ, вул.Йорданська 1, офіс 233 (2 поверх)
                            "Elffix Сервіс"
                        </td>
                        <td>отримувач, безготівка</td>
                        <td></td>
                        <td><a href="https://online.dclink.ua/b2b/service/contacts" target="_blank" rel="noopener noreferrer">dclink.ua</a></td>
                    </tr>
                    <tr>
                        <td>Realme</td>
                        <td>ТОВ Ретейлкомпані</td>
                        <td>
                        Представник: Мормиш Лілія Олександрівна -
                        0932808506 <br/>
                            ЕДРПОУ - 43886122, м.Одеса, вул. Пантелеймонівська 21 (Цитрус Сервіс)
                        </td>
                        <td>отримувач, безготівка</td>
                        <td></td>
                        <td><a href="" target="_blank" rel="noopener noreferrer"></a></td>
                    </tr>
                    <tr>
                        <td>Samsung</td>
                        <td>FyooCha</td>
                        <td>
                            Отримувач: Решетняк Марина Олександрівна ФОП
                            ІПН:3256805260
                            <br />
                            Представник: Рибальченко Ярослав Леонідович -
                            0639606606
                            <br />
                            м.Івано-Франківськ НП№15
                        </td>
                        <td>отримувач, безготівка</td>
                        <td>0966302508</td>
                        <td><a href="https://samsungservice.com.ua/" target="_blank" rel="noopener noreferrer">samsungservice.com.ua</a></td>
                    </tr>
                    <tr>
                        <td>Xiaomi</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><a href="" target="_blank" rel="noopener noreferrer"></a></td>
                    </tr>
                    {/* <tr>
                        <td>Nokia</td>
                        <td>СВП Плюс</td>
                        <td>
                            Отримувач: Сулейманов Марат - 0930867181 <br />
                        </td>
                        <td>отримувач, безготівка</td>
                        <td>0930867181</td>
                        <td><a href="" target="_blank" rel="noopener noreferrer"></a></td>
                    </tr> */}
                    <tr>
                        <td>Nomi</td>
                        <td>Цитрус Сервіс/ТОВ"Рітейл Компані"</td>
                        <td>
                            ЄДРПОУ: 43886122 представник - Мормиш Лілія:
                            0932808506
                            <br />
                        </td>
                        <td>отримувач, безготівка</td>
                        <td>0932808506</td>
                        <td><a href="" target="_blank" rel="noopener noreferrer"></a></td>
                    </tr>
                    <tr>
                        <td>Ergo</td>
                        <td>Юг</td>
                        <td>
                            Отримувач: Сімачков Сергій Олександрович - 0950675008
                            <br />
                            ТОВ "Сервіс сучасної електроніки", ЕДРПОУ 41632034
                            <br />
                            Київська обл., с. Чайки, вул Олеся Гончара 18
                            <br />
                            (Логістичний комплекс "AMTEL PROPERTIES")
                            <br />
                        </td>
                        <td>отримувач, безготівка</td>
                        <td>0950675008</td>
                        <td><a href="" target="_blank" rel="noopener noreferrer"></a></td>
                    </tr>
                    <tr>
                        <td>Sigma</td>
                        <td>ТОВ Дейна</td>
                        <td>
                            ЕДРПОУ - 43172452, м.Київ, склад №195 <br />
                            
                        </td>
                        <td>отримувач, безготівка</td>
                        <td>0664634047</td>
                        <td><a href="https://sigmamobile.net/pidtrimka/" target="_blank" rel="noopener noreferrer"></a>sigmamobile.net</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default RepairInfo;
