/*
 * Copyright 2021 NEM (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */

import * as React from 'react';
import { Link, ModalBox } from 'src/components';
import ArtistMahoImageUrl from 'src/assets/images/artist-maho.png';
import './Art.less';
interface Props {
    className?: string;
    src?: string;
    imageClassName?: string;
    linkText?: string;
    artName?: string;
    artDescription?: string;
}

export const Art: 
    React.FunctionComponent<Props> 
    = (props): JSX.Element => {
    const { 
        className,
        src,
        imageClassName,
        linkText,
    } = props;

    const [showModal, setShowModal] = React.useState(false);

    const extendedClassName = 'art' + (className ? ' ' + className : '');
    const artistWebsiteText = 'www.maho.tokyo/home';
    const artistWebsiteUrl = 'https://www.maho.tokyo/home';
    const artistTwitterUrl = 'https://twitter.com';
    const artistInstagramUrl = 'https://instagram.com';

    return (<>
        <div className={extendedClassName}>
            <img src={src} className={imageClassName} />
            {linkText && <Link onClick={() => setShowModal(true)}>{linkText}</Link>}
        </div>
        <ModalBox
            visible={showModal}
            onClose={() => setShowModal(false)}
        >
            <div className="art-modal">
                <div className="art-modal-artist">
                    <img className="art-modal-artist-avatar" src={ArtistMahoImageUrl} />
                    <div>
                        <a 
                            className="artist-website-link"
                            href={artistWebsiteUrl}
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            {artistWebsiteText}
                        </a>
                        <div className="art-modal-artist-social">
                            <a 
                                href={artistTwitterUrl}
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <svg 
                                    width="49" 
                                    height="48" 
                                    viewBox="0 0 49 48" 
                                    fill="none" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        d="M24.0458 48L23.7747 47.8596C12.8501 41.4727 4.8829 31.0375 1.60001 18.8161C1.07608 16.8495 0.679937 14.851 0.414067 12.8332C0.160734 10.808 0.0233599 8.77006 0.00261795 6.72922C0.00261795 6.38554 -0.0457879 6.42911 0.27369 6.24517C4.28783 3.96981 8.61006 2.28722 13.1061 1.24969C14.773 0.859277 16.46 0.560329 18.1596 0.354182C20.4966 0.0776364 22.8499 -0.0371971 25.2027 0.0105011C26.5387 0.0105011 27.8456 0.121834 29.1526 0.262211C35.6723 0.953598 41.9825 2.96803 47.6968 6.18224L47.9534 6.32261C47.997 6.34229 48.0341 6.37425 48.0599 6.41459C48.083 6.4577 48.0947 6.50604 48.0938 6.55496V6.8938C48.0696 8.08458 48.0211 9.256 47.9292 10.4468C47.7945 12.1428 47.565 13.83 47.2418 15.5004C46.5642 19.0812 45.4709 22.5706 43.9841 25.8979C41.6428 31.1672 38.3623 35.9665 34.303 40.0614C31.3696 43.0453 28.0559 45.6298 24.4475 47.7483C24.312 47.8403 24.1958 47.908 24.0458 48Z" 
                                        fill="#4FB9AC"
                                    />
                                    <path 
                                        d="M37.6306 12.7905C36.6853 13.2072 35.6839 13.4829 34.6585 13.6086C35.7384 12.96 36.5467 11.9419 36.9335 10.743C35.9178 11.346 34.8061 11.7701 33.6468 11.9967C32.9369 11.2412 32.0164 10.7164 31.0047 10.4903C29.9929 10.2642 28.9366 10.3472 27.9726 10.7285C27.0086 11.1098 26.1814 11.7719 25.5981 12.629C25.0148 13.486 24.7024 14.4985 24.7014 15.5351C24.6995 15.9406 24.7433 16.3449 24.8321 16.7405C22.7802 16.6384 20.7724 16.1076 18.9382 15.1821C17.104 14.2567 15.4841 12.9572 14.1828 11.3674C13.5249 12.5021 13.3229 13.8445 13.6177 15.1225C13.9125 16.4006 14.6821 17.5188 15.7705 18.2507C14.9377 18.2219 14.1241 17.9928 13.3987 17.5827V17.6505C13.4011 18.8459 13.817 20.0036 14.5757 20.9274C15.3345 21.8511 16.3894 22.484 17.5616 22.7186C16.8005 22.9231 16.0032 22.9545 15.2284 22.8105C15.5579 23.8401 16.2023 24.7402 17.0709 25.3838C17.9394 26.0273 18.9881 26.3819 20.069 26.3974C18.2373 27.8318 15.9768 28.6092 13.6504 28.6047C13.2378 28.6006 12.8258 28.5748 12.416 28.5273C14.7864 30.0516 17.5461 30.86 20.3642 30.8556C29.8953 30.8556 35.0796 22.9703 35.0796 16.1402V15.4674C36.0832 14.7349 36.9473 13.8283 37.6306 12.7905Z" 
                                        fill="white"
                                    />
                                </svg>
                            </a>
                            <a 
                                href={artistInstagramUrl}
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <svg 
                                    width="49" 
                                    height="48" 
                                    viewBox="0 0 49 48" 
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        d="M24.4305 48L24.1595 47.8596C13.2349 41.4727 5.26767 31.0375 1.98477 18.8162C1.46084 16.8495 1.0647 14.851 0.798833 12.8332C0.545499 10.808 0.408126 8.77006 0.387384 6.72922C0.387384 6.38554 0.338978 6.42911 0.658456 6.24517C4.67259 3.96981 8.99482 2.28722 13.4908 1.24969C15.1578 0.859277 16.8448 0.560329 18.5444 0.354182C20.8814 0.0776364 23.2346 -0.0371971 25.5874 0.0105011C26.9234 0.0105011 28.2304 0.121834 29.5373 0.262211C36.0571 0.953598 42.3672 2.96803 48.0816 6.18224L48.3381 6.32262C48.3818 6.34229 48.4188 6.37425 48.4446 6.41459C48.4678 6.4577 48.4794 6.50604 48.4785 6.55496V6.8938C48.4543 8.08459 48.4059 9.25601 48.3139 10.4468C48.1793 12.1428 47.9498 13.83 47.6266 15.5004C46.949 19.0812 45.8557 22.5707 44.3689 25.8979C42.0276 31.1672 38.7471 35.9665 34.6877 40.0615C31.7543 43.0453 28.4407 45.6298 24.8323 47.7483C24.6968 47.8403 24.5806 47.908 24.4305 48Z" 
                                        fill="#4FB9AC"
                                    />
                                    <path 
                                        fill-rule="evenodd" 
                                        clip-rule="evenodd" 
                                        d="M32.757 18.774H30.8729C31.01 19.3069 31.0914 19.8636 31.0914 20.4393C31.0914 24.1178 28.1099 27.0987 24.4323 27.0987C20.7549 27.0987 17.7735 24.1178 17.7735 20.4393C17.7735 19.8636 17.8548 19.3069 17.9922 18.774H16.108V27.9311C16.108 28.3902 16.4808 28.7629 16.9413 28.7629H31.9235C32.384 28.7629 32.757 28.3902 32.757 27.9311V18.774ZM32.757 12.9477C32.757 12.4882 32.384 12.1153 31.9235 12.1153H29.427C28.9673 12.1153 28.5946 12.4882 28.5946 12.9477V15.4452C28.5946 15.9048 28.9673 16.2776 29.427 16.2776H31.9235C32.384 16.2776 32.757 15.9048 32.757 15.4452V12.9477V12.9477ZM24.4323 16.2776C22.1336 16.2776 20.2703 18.1407 20.2703 20.4393C20.2703 22.7378 22.1336 24.6019 24.4323 24.6019C26.7311 24.6019 28.5946 22.7378 28.5946 20.4393C28.5946 18.1407 26.7311 16.2776 24.4323 16.2776ZM32.757 31.2609H16.108C14.7293 31.2609 13.6113 30.1425 13.6113 28.7629V12.1153C13.6113 10.7364 14.7293 9.61865 16.108 9.61865H32.757C34.1361 9.61865 35.2535 10.7364 35.2535 12.1153V28.7629C35.2535 30.1425 34.1361 31.2609 32.757 31.2609Z"
                                        fill="white"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="art-modal-divider" />
                <div className="art-modal-content">
                    <div>
                        <h4>The Alpaca</h4>
                        <p>Gumbo beet greens corn soko endive gumbo gourd. 
                            Parsley shallot courgette tatsoi pea sprouts fava 
                            bean collard greens dandelion okra wakame tomato. 
                            Dandelion cucumber earthnut pea peanut soko zucchini.
                        </p>
                    </div>
                    <div>
                        <h4>About the Arist</h4>
                        <p>Gumbo beet greens corn soko endive gumbo gourd. 
                            Parsley shallot courgette tatsoi pea sprouts fava 
                            bean collard greens dandelion okra wakame tomato. 
                            Dandelion cucumber earthnut pea peanut soko zucchini.
                        </p>
                    </div>
                </div>
            </div>
        </ModalBox>
    </>);
}
