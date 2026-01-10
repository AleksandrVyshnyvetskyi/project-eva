import styles from "../../styles/Repairs.module.css";

const RepairInfo = () => {
    return (
        <div>
            <table className={styles.repairInfoTable}>
                <thead>
                    <tr>
                        <th>Бренд</th>
                        <th>Сервіс</th>
                        <th>Отримувач</th>
                        <th>Адреса</th>
                        <th>Оплата</th>
                        <th>Телефон</th>
                        <th>Сайт</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                        <td>Xiaomi</td>
                        <td>Майстерня №1</td>
                        <td></td>
                        <td>Кривий Ріг, пр.Університетський 36</td>
                        <td></td>
                        <td className={styles.phoneNumberColum}>38 (068) 870 10 01</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Oppo</td>
                        <td>Майстерня №1</td>
                        <td></td>
                        <td>Кривий Ріг, пр.Університетський 36</td>
                        <td></td>
                        <td className={styles.phoneNumberColum}>38 (068) 870 10 01</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Apple</td>
                        <td>Fyoocha</td>
                        <td>
                        ФОП Решетняк Марина Олександрівна, <br/>представник Рибальченко Ярослав Леонідович<br/>
38 (063) 96 06 606
                        </td>
                        <td>м. Івано-Франківськ, Нова Пошта №15</td>
                        <td>отримувач, безготівка</td>
                        <td className={styles.phoneNumberColum}>38 (050) 382 15 22</td>
                        <td>Telegram @pretzel80</td>
                    </tr>
                    <tr>
                        <td>Doogee</td>
                        <td>Гратіс</td>
                        <td></td>
                        <td>Київ, СЦ "Гратіс", вул. Сергія Набоки (Бажова), 15/20</td>
                        <td>отримувач, безготівка</td>
                        <td className={styles.phoneNumberColum}>38 (066) 272 15 25<br/>38 (067) 272 15 25</td>
                        <td><a href="https://gratis.com.ua/" target="_blank" rel="noopener noreferrer">gratis.com.ua</a></td>
                    </tr>
                    <tr>
                        <td>Samsung</td>
                        <td>Samsung</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.phoneNumberColum}></td>
                        <td><a href="https://www.samsung.com/ua/support/repair/" target="_blank" rel="noopener noreferrer">samsung.com</a></td>
                    </tr>
                    <tr>
                        <td>Motorola</td>
                        <td>ТОВ mti-Сервис</td>
                        <td>Тернадський Николай <br/>
                            +38 (096) 630 25 08 <br/>
                            ЕДРПО 39554115</td>
                        <td>м. Київ, вул. Белоруська 26</td>
                        <td>отримувач, безготівка</td>
                        <td className={styles.phoneNumberColum}>0 800 33 03 54</td>
                        <td><a href="https://mti-service.com.ua/" target="_blank" rel="noopener noreferrer">mti-service.com.ua</a></td>
                    </tr>
                    <tr>
                        <td>Oscal</td>
                        <td>Elffix Сервіс</td>
                        <td>ФОП Гайдар Олександр Іванович<br/>
                            код РНОКПП 3001602971 <br/>
                            +38(095)61 82 101</td>
                        <td> м. Київ, вул. Йорданська 1, офіс 233 (2 поверх) 
"Elffix Сервіс"</td>
                        <td>отримувач, безготівка</td>
                        <td className={styles.phoneNumberColum}>38 (098) 956 78 78<br/>
38 (095) 618 21 01</td>
                        <td><a href="https://elffix.com.ua" target="_blank" rel="noopener noreferrer">elffix.com.ua</a></td>
                    </tr>
                    <tr>
                        <td>Realme</td>
                        <td>ТОВ РитейлКомпані</td>
                        <td>Мормиш Лілія Олександрівна<br/>
38 (093) 280 85 06</td>
                        <td>м. Одеса вул. Пантелеймонівська 21 (Цитрус Сервіс)</td>
                        <td>отримувач, безготівка</td>
                        <td className={styles.phoneNumberColum}>38 (093) 170 20 33</td>
                        <td><a href="https://service.ctrs.com.ua/uk/" target="_blank" rel="noopener noreferrer">service.ctrs.com.ua</a></td>
                    </tr>
                    <tr>
                        <td>Sigma</td>
                        <td>ТОВ Дейна</td>
                        <td></td>
                        <td>м.Київ, Нова Пошта №195</td>
                        <td>отримувач, безготівка</td>
                        <td className={styles.phoneNumberColum}>38 (063) 417 7852<br/>
 38 (068) 307 5674<br/>
 38 (066) 463 4047</td>
                        <td><a href="https://www.sigmamobile.net/servisnye-tsentry" target="_blank" rel="noopener noreferrer">sigmamobile.net</a></td>
                    </tr>
                    <tr>
                        <td>Ergo</td>
                        <td>ТОВ "Сервіс сучасної електроніки" ЕДРПОУ 41632034</td>
                        <td> Сімачков Сергій Олександрович <br/>
+38(095)06 75 008</td>
                        <td>с. Білогородка, Київська обл., вул Компресорна 3<br/>
(Логістичний комплекс "AMTEL PROPERTIES")</td>
                        <td>отримувач, безготівка</td>
                        <td className={styles.phoneNumberColum}>(044) 247-67-34</td>
                        <td><a href="https://www.modern-service.com.ua" target="_blank" rel="noopener noreferrer">modern-service.com.ua</a></td>
                    </tr>
                    <tr>
                        <td>Nomi</td>
                        <td>Цифротех</td>
                        <td>ТОВ "Цифротех"<br/>Скляров Владислав Олександрович,<br/>+38(095)90 07 510</td>
                        <td>Київ, пр-кт. Бандери Степана, 26</td>
                        <td>Третя особа за безготівковим розрахунком (Цифротех)</td>
                        <td className={styles.phoneNumberColum}></td>
                        <td><a href="" target="_blank" rel="noopener noreferrer"></a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default RepairInfo;
