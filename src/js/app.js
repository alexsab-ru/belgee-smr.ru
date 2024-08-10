import './data.alpine';
import './modules/scroll';
import './modules/modals';
import './modules/latest.posts';

import { connectForms, cookiecook } from '@alexsab-ru/scripts';
cookiecook();
connectForms('https://alexsab.ru/lead/belgee/partner-samara/', {
	confirmModalText: 'Вы уже оставляли заявку сегодня, с Вами обязательно свяжутся в ближайшее время!',
});

import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';
const lightbox = GLightbox({
	moreLength: 0,
	loop: true,
	slideEffect: 'fade',
});

const imageObserver = new IntersectionObserver((entries, observer) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.src = entry.target.dataset.src;
			observer.unobserve(entry.target);
		}
	});
	},
	{
		threshold: 0.5
	}
);

const lazys = document.querySelectorAll('.lazy');

if(lazys.length){
	lazys.forEach(lazy => {
		if(lazy.querySelector('img')){
			imageObserver.observe(lazy.querySelector('img'))
		}
		lazy.classList.remove('lazy')
	})
}



function executeRecaptcha() {
grecaptcha.ready(function() {
	grecaptcha.execute('6Lepfy4pAAAAAAGHFP655qNe6Bb_BcskklcxajC6', {action: 'belgee_partner_samara'}).then(function(token) {
		let formData = new FormData();
		formData.append('g-recaptcha-response', token);
		const params = new URLSearchParams([...formData]);
		fetch("https://alexsab.ru/lead/re/", {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: params,
		})
			.then((res) => res.json())
			.then((data) => {
				// console.log('Success:', data);
				window.re = data.data.response.success;
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	});
});
}

// Проверяем, определена ли grecaptcha
if (typeof grecaptcha === "undefined") {
	// Если grecaptcha не определена, устанавливаем интервал для проверки
	var checkRecaptchaAvailability = setInterval(function() {
		if (typeof grecaptcha !== "undefined") {
			// Как только grecaptcha становится доступной, очищаем интервал
			clearInterval(checkRecaptchaAvailability);
			// Выполняем код с grecaptcha
			executeRecaptcha();
		}
	}, 1000); // Проверяем каждую секунду
} else {
	// Если grecaptcha уже доступна, просто выполняем код
	executeRecaptcha();
}

// Редирект, если в конце URL больше одного слеша
const path = window.location.pathname;
const regex = /\/{2,}$/;
if(regex.test(path)){
	window.location.href = path.replace(regex, '/');
}

import { LAST_DAY, MONTH, YEAR } from '@/js/utils/numbers.format';

// Объект с заменами
const replacements = {
	lastDay: LAST_DAY,
	month: MONTH,
	year: YEAR,
};

// Функция для замены всех строк между {{ и }} по всему DOM
function replaceStringsInDOM(replacements) {
	// Получаем все текстовые узлы в документе
	const walker = document.createTreeWalker(
		document.body,
		NodeFilter.SHOW_TEXT,
		null,
		false
	);
	let node;

	// Регулярное выражение для поиска строк между {{ и }}
	const regex = /\{\{(.*?)\}\}/g;

	// Проходим по всем текстовым узлам
	while ((node = walker.nextNode())) {
		let originalText = node.nodeValue;
		let newText = originalText.replace(regex, (match, p1) => {
			// Если найденное значение есть в объекте replacements, заменяем его
			return replacements[p1.trim()] !== undefined
				? replacements[p1.trim()]
				: match;
		});

		// Если текст изменился, обновляем текстовый узел
		if (newText !== originalText) {
			node.nodeValue = newText;
		}
	}
}

// Пример использования
replaceStringsInDOM(replacements);
