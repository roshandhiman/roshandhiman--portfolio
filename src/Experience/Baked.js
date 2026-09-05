import { Mesh, MeshBasicMaterial, SRGBColorSpace, PlaneGeometry, CanvasTexture } from "three";
import Experience from "./Experience.js";

export default class Baked {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer.instance;
    this.maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.setModels();
  }

  setMaterial = (object, material) => {
    object.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
  };

  configureTexture = (texture) => {
    texture.anisotropy = this.maxAnisotropy;
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  };

  setModels = () => {
    this.model = {};
    this.model.room1 = this.resources.items._roomModel.scene;

    this.bakedTexture1 = this.configureTexture(this.resources.items.baked1);
    this.model.material = new MeshBasicMaterial({
      map: this.bakedTexture1,
    });

    this.model.room2 = this.resources.items._roomModel2.scene;
    this.bakedTexture2 = this.configureTexture(this.resources.items.baked2);

    this.model.material2 = new MeshBasicMaterial({
      map: this.bakedTexture2,
    });

    this.model.room3 = this.resources.items._roomModel3.scene;
    this.bakedTexture3 = this.configureTexture(this.resources.items.baked3);

    this.model.material3 = new MeshBasicMaterial({
      map: this.bakedTexture3,
    });

    this.model.linkedin = this.resources.items.linkedin.scene;
    this.model.linkedin.name = "linkedin";
    this.model.github = this.resources.items.github.scene;
    this.model.github.name = "github";

    this.setMaterial(this.model.room1, this.model.material);
    this.setMaterial(this.model.room2, this.model.material2);
    this.setMaterial(this.model.room3, this.model.material3);
    this.setMaterial(this.model.linkedin, this.model.material3);
    this.setMaterial(this.model.github, this.model.material3);

    this.setupClapperboard();

    this.setupProfileFrame();

    this.scene.add(this.model.room1);
    this.scene.add(this.model.room2);
    this.scene.add(this.model.room3);

    this.scene.add(this.model.linkedin);
    this.scene.add(this.model.github);
  };

  setupProfileFrame = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    const render = (img) => {
      ctx.clearRect(0, 0, 1024, 1024);

      ctx.fillStyle = "#262322";
      ctx.fillRect(0, 0, 1024, 1024);

      ctx.fillStyle = "#fdfdfd";
      ctx.fillRect(40, 40, 944, 944);

      const photoX = 72;
      const photoY = 72;
      const photoW = 880;
      const photoH = 880;

      if (img && (img.width || img.naturalWidth)) {
        const iw = img.naturalWidth || img.width;
        const ih = img.naturalHeight || img.height;
        const imgRatio = iw / ih;
        const targetRatio = photoW / photoH;

        let sx, sy, sw, sh;
        if (imgRatio > targetRatio) {
          sh = ih;
          sw = ih * targetRatio;
          sx = (iw - sw) / 2;
          sy = 0;
        } else {
          sw = iw;
          sh = iw / targetRatio;
          sx = 0;
          sy = (ih - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
      } else {
        ctx.fillStyle = "#1e1e1e";
        ctx.fillRect(photoX, photoY, photoW, photoH);
      }

      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
      ctx.lineWidth = 4;
      ctx.strokeRect(photoX, photoY, photoW, photoH);

      tex.needsUpdate = true;
    };

    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = this.maxAnisotropy;

    const mat = new MeshBasicMaterial({
      map: tex,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    const geom = new PlaneGeometry(0.66, 0.66);
    const photoMesh = new Mesh(geom, mat);
    photoMesh.name = "profilePhotoFrame";
    photoMesh.position.set(-0.841, 2.678, -4.628);
    this.scene.add(photoMesh);

    render(null);

    const profileImg = new Image();
    profileImg.crossOrigin = "anonymous";
    profileImg.onload = () => {
      render(profileImg);
    };
    profileImg.src = "/assets/images/profile.jpg";

    if (this.resources.items.profilePhoto) {
      const resItem = this.resources.items.profilePhoto;
      const existing = resItem.image || resItem;
      if (existing instanceof HTMLImageElement && existing.complete && existing.naturalWidth > 0) {
        render(existing);
      }
    }
  };

  setupClapperboard = () => {
    this.model.room3.traverse((child) => {
      if (child.isMesh && child.name && child.name.toLowerCase().includes("claqueta")) {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 672;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#141414";
        ctx.fillRect(0, 0, 1024, 672);

        ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
        for (let i = 0; i < 200; i++) {
          const rx = Math.random() * 1024;
          const ry = Math.random() * 672;
          ctx.fillRect(rx, ry, Math.random() * 4 + 1, Math.random() * 4 + 1);
        }

        ctx.fillStyle = "#f4f4f4";
        ctx.font = "900 82px 'Arial Black', 'Impact', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("ROSHAN", 512, 110);

        ctx.font = "bold 44px 'Arial Black', sans-serif";
        ctx.fillStyle = "#d0d0d0";
        ctx.fillText("SINGH DHIMAN", 512, 195);

        ctx.strokeStyle = "rgba(240, 240, 240, 0.85)";
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.moveTo(35, 255);
        ctx.lineTo(989, 255);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(35, 435);
        ctx.lineTo(989, 435);
        ctx.stroke();

        ctx.fillStyle = "#e0e0e0";
        ctx.font = "bold 46px 'Arial Black', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("SCENE:  01", 80, 345);

        ctx.textAlign = "right";
        ctx.fillText("TAKE:  01", 944, 345);

        ctx.fillStyle = "#ffffff";
        ctx.font = "900 68px 'Arial Black', 'Impact', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PORTFOLIO", 512, 545);

        const tex = new CanvasTexture(canvas);
        tex.colorSpace = SRGBColorSpace;
        tex.anisotropy = this.maxAnisotropy;
        tex.needsUpdate = true;

        const mat = new MeshBasicMaterial({
          map: tex,
          depthWrite: true,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
        });

        const geom = new PlaneGeometry(0.615, 0.40);
        const facePlane = new Mesh(geom, mat);
        facePlane.position.set(0.13, -0.175, 0.015);

        child.add(facePlane);
      }
    });
  };
}
