docker build --tag shieldgenerator7/agranari .

docker push shieldgenerator7/agranari



:: Links

:: https://hub.docker.com/r/shieldgenerator7/agranari/tags

:: https://console.cloud.google.com/run/detail/us-central1/agranari/revisions?project=creaturecombat




:: DEPLOY INSTRUCTIONS




:: CLIENT
:: make sure you push all your changes on main
:: switch to gh-pages branch in github
:: pull all changes from main into gh-pages
:: run deployFull.bat
:: copy build folder contents into game folder in the top level repository folder
:: commit those changes, push those commits
:: > Client Done!



::SERVER
:: Make sure you have docker hub running
:: run the deployFull bat first
:: run this bat file, wait for it to finish
:: go to the google cloud page and make a new revision: "edit & deploy new revision"
:: wait for that to finish
:: > Server done!



:: user link:
:: https://shieldgenerator7.github.io/AgranariTTRPG/game/?url=https://latest---agranari-zxrggs7xhq-uc.a.run.app/