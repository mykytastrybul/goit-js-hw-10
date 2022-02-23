import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';
const inputRef = document.querySelector('input#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
inputRef.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));
function onInputSearch(evt) {
    const inputValue = evt.target.value.trim().toLowerCase();
    if (inputValue === '') {
        countryListRef.innerHTML = '';
        countryInfoRef.innerHTML = '';
        return;
    }
    fetchCountries(`${inputValue}?fields=name,capital,population,flags,languages`)
        .then(markup)
        .catch(() => {
            countryListRef.innerHTML = '';
            countryInfoRef.innerHTML = '';
            Notiflix.Notify.failure('Oops, there is no country with that name.');
        });
}
function markup(serverDataList) {
    if (serverDataList.length > 10) {
        countryListRef.innerHTML = '';
        countryInfoRef.innerHTML = '';
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        return;
    }
    if (serverDataList.length === 1) {
        countryInfoRef.innerHTML = countryInfo(serverDataList[0]);
        countryListRef.innerHTML = '';
        return;
    }
    countryInfoRef.innerHTML = '';
    countryListRef.innerHTML = countryList(serverDataList);
}
function countryInfo({ name, flags, capital, population, languages }) {
    return `<div style="display: flex;">
    <img src="${flags.svg}" alt="Flag of ${name.official}.">
    <h1 style="font-size: 20px;margin-left: 8px">${name.official}</h1>
    </div>
    <p><span>Capital:</span> ${capital}</p>
    <p><span>Population:</span> ${population}</p>
    <p><span>Languages:</span> ${Object.values(languages)}</p>`;
};
function countryList(serverDataList) {
    return serverDataList
        .map(({ flags, name }) => {
            return `<li style="display: flex;">
            <img src="${flags.svg}" alt="Flag of ${name.official}">
            <p style="margin-left: 8px;"><span>${name.official}</span></p>
            </li>`;
        })
        .join('');
};