import styles from "./index.module.scss";

export default function Acknowledgments() {
	return (
		<>
			<section class={styles.container}>
				<h1 class="title">
					هذا المشروع لم يكن ليكون لولا كل من ساهم فيه. شكراً جزيلاً لكم!
				</h1>

				<div class={styles.body}>
					<h2>المساهمين (بدون ترتيب مُحدد):</h2>
					<ul>
						<li>
							<a href="https://github.com/nightmodd">
								مصطفى إسماعيل (الفكرة, تجميع البيانات)
							</a>
						</li>
						<li>
							<a>بسمله إسماعيل (تجميع البيانات)</a>
						</li>
						<li>
							<a href="https://karimshalapy.github.io/">
								كريم شلبي (الفكرة, البرمجة)
							</a>
						</li>
						<li>
							<a href="https://github.com/omarabdelaz1z">
								عمر عبدالعزيز (الفكرة, تجهيز البيانات)
							</a>
						</li>
						<li>
							<a href="https://www.facebook.com/hagar.abduzaher">
								هاجر عبدالظاهر (تجميع البيانات)
							</a>
						</li>
					</ul>

					<p>
						وشُكر خاص للمُصَمِّم{" "}
						<a href="https://roupenjam.webflow.io/">روبين جامجوتشيان</a> على
						مَجْهُودَاتِه فِي تَصْمِيم المَوْقِع.
					</p>

					<p>
						وشُكر خاص للمُصَمِّم{" "}
						<a href="https://www.29lt.com/designer/pascal-zoghbi/">
							باسكال زُغبِي
						</a>{" "}
						لِمَنْحِه إيَّانا حَق اسْتِخدام الَخط العَرَبي{" "}
						<a href="https://www.29lt.com/product/29lt-ada-sharp/">آدا شآرب</a>.
					</p>

					<p>
						وشُكْر خاص لفريق عمل{" "}
						<a href="https://www.29lt.com/info/">29ليترز تايب فاوندري</a>{" "}
						لإنتاجهم واحد من أجمل الخطوط العربية الرقمية.
					</p>
				</div>
			</section>
		</>
	);
}
