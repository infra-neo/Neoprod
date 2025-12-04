FROM dorowu/ubuntu-desktop-lxde-vnc:latest

LABEL maintainer="Neogenesys"
LABEL description="Ubuntu Desktop con Wine para ejecutar aplicaciones Windows"

# Instalar Wine y dependencias
RUN apt-get update && apt-get install -y \
    wine \
    wine32 \
    wine64 \
    winetricks \
    cabextract \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Configurar Wine
RUN mkdir -p /home/wine/.wine
ENV WINEPREFIX=/home/wine/.wine
ENV WINEARCH=win64

# Instalar fuentes de Windows
RUN winetricks -q corefonts

# Personalización Neogenesys
COPY branding/wallpaper.jpg /usr/share/backgrounds/neogenesys.jpg
COPY branding/logo.png /usr/share/pixmaps/neogenesys-logo.png

# Configurar fondo de pantalla
RUN echo "pcmanfm --set-wallpaper=/usr/share/backgrounds/neogenesys.jpg" >> /root/.bashrc

EXPOSE 6080 5900

CMD ["/startup.sh"]
