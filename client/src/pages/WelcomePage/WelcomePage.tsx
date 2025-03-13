
import  { JSX } from "react";
import { motion } from "framer-motion"; // Импортируем motion из framer-motion
import Parallax from "@/features/parallax/ui/Parallax";
import styles from "./WelcomePage.module.css";

export function WelcomePage(): JSX.Element {

  const linkVariants = (index: number) => ({
    hidden: { opacity: 0, x: index % 2 === 0 ? -100 : 100 }, // Четные — слева, нечетные — справа
    visible: { opacity: 1, x: 0 },
  });

  return (
    <>
      <div>
        <Parallax />
        <div className={styles.underParallax}>
        <div
          
        >
          <div></div>
          <div className={styles.linkList}>
            <div>
              <motion.div
                className={styles.linkItem}
                variants={linkVariants(2)} // Передаем индекс элемента
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.5, delay: 2 * 0.2 }} // Задержка зависит от индекса
              >
                <div className={styles.linkCard}> <img className={styles.img} src='/div1.png' /></div> 
                <div className={styles.linkCard}> Посмотреть готовые маршруты</div>
              </motion.div>
            </div>

            <motion.div
              className={styles.linkItem}
              variants={linkVariants(1)} // Передаем индекс элемента
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.5, delay: 1 * 0.2 }} // Задержка зависит от индекса
            >
              <div className={styles.linkCard}> <img className={styles.img} src='/div2.png' /></div> 
              <div className={styles.linkCard}> Построить свой маршрут</div>
            </motion.div>

            <div>
              <motion.div
                className={styles.linkItem}
                variants={linkVariants(2)} // Передаем индекс элемента
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.5, delay: 2 * 0.2 }} // Задержка зависит от индекса
              >
                <div className={styles.linkCard}> <img className={styles.img} src='/div3.png' /></div> 
                <div className={styles.linkCard}> Календарик путешествий</div>
              </motion.div>
            </div>

            <div>
              <motion.div
                className={styles.linkItem}
                variants={linkVariants(1)} // Передаем индекс элемента
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.5, delay: 1 * 0.2 }} // Задержка зависит от индекса
              >
                <div className={styles.linkCard}> <img className={styles.img} src='/div4.png' /></div> 
                <div className={styles.linkCard}> Советы бывалых</div>
              </motion.div>
            </div>

            <div>
              <motion.div
                className={styles.linkItem}
                variants={linkVariants(2)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.5, delay: 2 * 0.6 }}
              >
                <div className={styles.linkCard}> <img className={styles.img} src='/div5.jpg' /></div> 
                <div className={styles.linkCard}> Планер для большой (и не только) компании</div>
              </motion.div>
            </div>

          </div>
        </div>
        </div>
      </div>
    </>
  );
}
