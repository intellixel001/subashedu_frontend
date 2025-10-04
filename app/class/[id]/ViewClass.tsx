import { Class } from "@/app/admin/manage-class/page";
import JoinLiveClass from "./JoinLiveClass";
import RecordedClassPlayer from "./RecordedClassPlayer";

export default function ViewClass({ freeClass }: { freeClass: Class }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{freeClass.title}</h1>
      <p className="text-gray-600">{freeClass.subject}</p>

      {freeClass.type === "live" ? (
        <JoinLiveClass
          startTime={freeClass.startTime}
          isActiveLive={freeClass.isActiveLive}
        />
      ) : (
        <RecordedClassPlayer videoLink={freeClass.videoLink} />
      )}
    </div>
  );
}
