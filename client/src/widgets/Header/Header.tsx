import { SignInModal } from '@/features/auth/SignInModal/SignInModal';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { useAppSelector } from '@/shared/hooks/reduxHooks';
import { JSX, useCallback, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import styles from './Header.module.css';

export function Header(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const user = useAppSelector((state) => state.user.user);
  const location = useLocation();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    setIsScrolled(false);
  }, [location.pathname]);

  const handleScroll = useCallback(() => {
    const isMainPage = location.pathname === CLIENT_ROUTES.MAIN;
    if (!isMainPage) return;

    const viewportHeight = window.innerHeight;
    setIsScrolled(window.scrollY > viewportHeight);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== CLIENT_ROUTES.MAIN) {
      setIsScrolled(true);
      return;
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, handleScroll]);

  return (
    <nav
      className={`${styles.container} ${isScrolled ? styles.scrolled : ''}`}
      data-page={location.pathname === CLIENT_ROUTES.MAIN ? 'main' : 'other'}
    >
      <div className={styles.logo}>
        <NavLink to={CLIENT_ROUTES.MAIN}>TRAVEL PLAN</NavLink>
      </div>

      <div className={styles.navLinks}>
        <NavLink to={CLIENT_ROUTES.PUBLIC_ROADS_PAGE}>Маршруты</NavLink>
        {user ? (
          <>
            <NavLink to={CLIENT_ROUTES.CABINET_PAGE}>
              <span className={styles.username}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 513 513"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M255.797 0.00323645C256.547 0.00505926 257.298 0.00688208 258.072 0.00876013C269.014 0.0535079 279.418 0.488392 290.047 3.31574C290.728 3.48734 291.41 3.65895 292.113 3.83576C314.798 9.59459 335.204 20.2277 353.047 35.3157C353.913 36.0402 354.779 36.7646 355.672 37.511C376.827 55.7364 391.534 81.3042 399.297 107.878C399.666 109.135 399.666 109.135 400.043 110.418C403.53 122.889 404.426 135.186 404.359 148.066C404.357 148.818 404.355 149.569 404.353 150.344C404.302 161.295 403.899 171.684 401.047 182.316C400.853 183.079 400.66 183.842 400.461 184.628C394.502 207.875 383.737 228.187 368.047 246.316C367.366 247.119 366.685 247.922 365.984 248.749C359.153 256.661 351.341 262.999 343.047 269.316C345.626 271.895 348.064 272.586 351.484 273.878C394.396 290.635 433.735 320.054 461.047 357.316C461.684 358.17 461.684 358.17 462.334 359.041C468.849 367.782 474.682 376.827 480.047 386.316C480.449 387.023 480.851 387.73 481.265 388.459C502.729 426.582 512.597 468.82 512.047 512.316C498.517 512.316 484.987 512.316 471.047 512.316C470.717 505.716 470.387 499.116 470.047 492.316C469.587 488.038 469.098 483.864 468.422 479.628C468.25 478.548 468.079 477.468 467.903 476.355C462.406 443.734 449.402 411.533 429.047 385.316C428.179 384.155 427.313 382.992 426.449 381.827C422.496 376.538 418.496 371.471 413.687 366.921C411.87 365.143 410.251 363.257 408.609 361.316C405.07 357.227 401.2 353.768 397.047 350.316C396.269 349.651 395.492 348.985 394.691 348.3C391.854 345.914 388.969 343.596 386.047 341.316C385.479 340.871 384.912 340.426 384.327 339.968C358.714 320.188 328.5 307.993 297.047 301.316C296.234 301.136 295.422 300.957 294.586 300.772C242.669 289.771 185.381 302.915 140.876 330.669C136.792 333.375 132.915 336.312 129.047 339.316C127.885 340.184 126.723 341.05 125.558 341.913C120.269 345.866 115.202 349.866 110.652 354.675C108.874 356.492 106.988 358.112 105.047 359.753C100.958 363.293 97.4987 367.163 94.0465 371.316C93.3814 372.093 92.7162 372.87 92.0309 373.671C89.6443 376.509 87.3269 379.393 85.0465 382.316C84.6018 382.883 84.1571 383.45 83.6989 384.035C61.8101 412.379 48.4945 446.804 43.234 482.066C43.1221 482.807 43.0102 483.548 42.8949 484.312C41.6587 493.624 41.5177 502.892 41.0465 512.316C27.5165 512.316 13.9865 512.316 0.0465394 512.316C-1.22391 447.523 23.5651 383.882 68.4347 336.986C77.5348 327.555 86.5728 318.244 97.0465 310.316C97.5854 309.9 98.1242 309.485 98.6794 309.057C120.268 292.461 143.747 280.196 169.047 270.316C165.807 267.03 162.497 263.878 159.047 260.816C155.608 257.738 152.268 254.622 149.047 251.316C148.478 250.792 147.91 250.269 147.324 249.73C130.334 233.719 119.254 210.858 112.797 188.753C112.55 187.915 112.304 187.077 112.05 186.213C108.563 173.741 107.669 161.446 107.734 148.566C107.736 147.815 107.738 147.064 107.74 146.291C107.784 135.348 108.219 124.944 111.047 114.316C111.218 113.634 111.39 112.952 111.567 112.249C117.325 89.564 127.958 69.1586 143.047 51.3157C143.771 50.4495 144.495 49.5832 145.242 48.6907C163.467 27.535 189.035 12.8286 215.609 5.06574C216.447 4.81928 217.285 4.57283 218.149 4.31891C230.621 0.832446 242.917 -0.0616972 255.797 0.00323645ZM173.047 79.3157C153.324 104.089 145.943 133.763 149.351 165.118C153.495 192.119 168.828 216.811 190.074 233.726C215.108 251.767 244.609 259.346 275.343 254.628C302.589 249.45 327.52 233.628 343.734 211.128C360.349 186.012 367.618 156.686 361.917 126.694C355.645 98.9687 339.384 74.206 315.558 58.4446C268.026 29.0082 210.184 37.8741 173.047 79.3157Z"
                    fill="black"
                  />
                </svg>
                {user.username}
              </span>
            </NavLink>
          </>
        ) : (
          <button onClick={openModal} className={styles.authButton}>
            Войти
          </button>
        )}
      </div>

      {isModalOpen && <SignInModal closeModal={closeModal} />}
    </nav>
  );
}
