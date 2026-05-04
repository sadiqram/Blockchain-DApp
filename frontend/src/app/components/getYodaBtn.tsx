import { getFreeYoda } from "../utils/getYoda";

<button
  onClick={async () => {
    const res = await getFreeYoda();

    if (res.success) {
      alert("YODA claimed!");
    } else {
      alert(res.error);
    }
  }}
>
  Get Free YODA
</button>;
