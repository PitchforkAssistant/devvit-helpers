import {Devvit} from "@devvit/public-api";

/**
 * RoundedImageProps extends {@linkcode Devvit.Blocks.ImageProps} by allowing for a `cornerRadius` at the expense of less options for `resizeMode`.
 * `resizeMode` does not allow for `fit` or `scale-down` as those options would not work with using the `cornerRadius` of a parent `zstack`.
 * Some of the properties of {@linkcode Devvit.Blocks.StackProps} are also included to allow for more customization.
 * The children of this element will be displayed on top of the image, but will be clipped by the `cornerRadius` of the parent `zstack`.
 * If `resizeMode` is not provided, it defaults to `cover`.
 */
export type RoundedImageProps = Omit<Devvit.Blocks.ImageProps, "resizeMode"> & {
    border?: Devvit.Blocks.ContainerBorderWidth;
    borderColor?: Devvit.Blocks.ColorString;
    lightBorderColor?: Devvit.Blocks.ColorString;
    darkBorderColor?: Devvit.Blocks.ColorString;
    cornerRadius?: Devvit.Blocks.ContainerCornerRadius;
    backgroundColor?: Devvit.Blocks.ColorString;
    lightBackgroundColor?: Devvit.Blocks.ColorString;
    darkBackgroundColor?: Devvit.Blocks.ColorString;
    resizeMode?: Extract<Devvit.Blocks.ImageResizeMode, "none" | "cover" | "fill">;
} & Devvit.Blocks.HasElementChildren;

/**
 * RoundedImage allows you to round the corners of an arbitrary image by wrapping it in a {@linkcode Devvit.Blocks.IntrinsicElements.zstack}.
 * @param props {@link RoundedImageProps} Modified version of {@linkcode Devvit.Blocks.ImageProps} that allows for a `cornerRadius` at the expense of fewer `resizeMode` options. Also provides some properties of {@linkcode Devvit.Blocks.StackProps} for more customization.
 * @returns {JSX.Element} Uses a {@linkcode Devvit.Blocks.IntrinsicElements.zstack} with a {@linkcode Devvit.Blocks.IntrinsicElements.image} as the child.
 */
export const RoundedImage = (props: RoundedImageProps): JSX.Element => (
    <zstack
        alignment="center middle"
        backgroundColor={props.backgroundColor}
        border={props.border}
        borderColor={props.borderColor}
        cornerRadius={props.cornerRadius}
        darkBackgroundColor={props.darkBackgroundColor}
        darkBorderColor={props.darkBorderColor}
        height={props.imageHeight}
        lightBackgroundColor={props.lightBackgroundColor}
        lightBorderColor={props.lightBorderColor}
        width={props.imageWidth}
    >
        <image {...props} resizeMode={props.resizeMode ?? "cover"} />
        {props.children ? props.children : null}
    </zstack>
);

