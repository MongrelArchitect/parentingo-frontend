import defaultAvatarIcon from "@assets/icons/account-circle.svg";

interface Props {
  avatarURL: string | undefined;
  maxWidth: number;
  invalid?: boolean;
}

export default function Avatar({ avatarURL, invalid, maxWidth }: Props) {
  const avatarStyle = {
    borderColor: invalid ? "#dc2626" : "#0f172a",
    maxWidth,
  };

  return (
    <div
      style={avatarStyle}
      className="relative flex aspect-square h-auto w-full items-center justify-center rounded-full border-2 bg-white"
    >
      <img
        alt=""
        className="absolute left-0 top-0 h-auto w-full rounded-full"
        src={avatarURL || defaultAvatarIcon}
        style={avatarStyle}
      />
    </div>
  );
}
