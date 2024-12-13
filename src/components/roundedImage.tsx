import {Devvit} from "@devvit/public-api";

/**
 * RoundedImageProps extends {@linkcode Devvit.Blocks.ImageProps} by allowing for a `cornerRadius` at the expense of less options for `resizeMode`.
 * `resizeMode` does not allow for `fit` or `scale-down` as those options would not work with using the `cornerRadius` of a parent `zstack`.
 * If `resizeMode` is not provided, it defaults to `cover`.
 */
export type RoundedImageProps = Omit<Devvit.Blocks.ImageProps, "resizeMode"> & {
    cornerRadius?: Devvit.Blocks.ContainerCornerRadius;
    resizeMode?: Extract<Devvit.Blocks.ImageResizeMode, "none" | "cover" | "fill">;
};

/**
 * RoundedImage allows you to round the corners of an arbitrary image by wrapping it in a {@linkcode Devvit.Blocks.IntrinsicElements.zstack}.
 * @param props {@link RoundedImageProps} Modified version of {@linkcode Devvit.Blocks.ImageProps} that allows for a `cornerRadius` at the expense of fewer `resizeMode` options.
 * @returns {JSX.Element} Uses a {@linkcode Devvit.Blocks.IntrinsicElements.zstack} with a {@linkcode Devvit.Blocks.IntrinsicElements.image} as the child.
 */
export const RoundedImage = (props: RoundedImageProps) => (
    <zstack width={props.imageWidth} height={props.imageHeight} cornerRadius={props.cornerRadius} alignment="center middle">
        <image {...props} resizeMode={props.resizeMode ?? "cover"}/>
    </zstack>
);

